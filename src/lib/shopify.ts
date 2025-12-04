const SHOPIFY_STOREFRONT_API_VERSION = "2024-01";

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface CartItem {
  merchandiseId: string; // gid://shopify/ProductVariant/xxx
  quantity: number;
  updatedAt: string; // ISO timestamp - when this item was last modified
  deleted?: boolean; // soft delete for conflict resolution
}

export interface StoredCart {
  customerId: string; // gid://shopify/Customer/xxx or "guest"
  items: CartItem[];
  updatedAt: string; // ISO datetime - last change to any item
  version: number; // for optimistic concurrency
}

// Guest cart structure (sent from client on login)
export interface GuestCart {
  items: CartItem[];
  deviceId?: string; // optional device identifier
}

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
}

export interface ShopifyAdminConfig {
  storeDomain: string;
  adminAccessToken: string; // shpat_xxx
}

type ShopifyGraphQLError = { message: string; extensions?: Record<string, unknown> };

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: ShopifyGraphQLError[];
}

export class ShopifyError extends Error {
  readonly status: number;
  readonly errors?: ShopifyGraphQLError[];
  // Raw response body (best‑effort) for debugging
  readonly responseBody?: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      errors?: ShopifyGraphQLError[];
      responseBody?: unknown;
      cause?: unknown;
    } = {}
  ) {
    super(message);
    this.name = "ShopifyError";
    this.status = options.status ?? 500;
    this.errors = options.errors;
    this.responseBody = options.responseBody;

    if (options.cause) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).cause = options.cause;
    }
  }
}

async function shopifyGraphQLFetch<T>(
  url: string,
  headers: Record<string, string>,
  query: string,
  variables: Record<string, unknown>,
  apiName: string
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ query, variables }),
    });
  } catch (err) {
    throw new ShopifyError(`Failed to reach Shopify ${apiName}`, {
      status: 502,
      cause: err,
    });
  }

  let rawBody: string | undefined;

  try {
    rawBody = await response.text();
  } catch (err) {
    throw new ShopifyError(`Failed to read Shopify ${apiName} response body`, {
      status: response.status || 502,
      cause: err,
    });
  }

  let json: ShopifyGraphQLResponse<T> = {};

  try {
    json = rawBody ? (JSON.parse(rawBody) as ShopifyGraphQLResponse<T>) : {};
  } catch {
    throw new ShopifyError(`Invalid JSON from Shopify ${apiName}`, {
      status: response.status || 502,
      responseBody: rawBody,
    });
  }

  if (!response.ok) {
    throw new ShopifyError(`Shopify ${apiName} error: ${response.status}`, {
      status: response.status,
      errors: json.errors,
      responseBody: Object.keys(json).length ? json : rawBody,
    });
  }

  if (json.errors && json.errors.length > 0) {
    throw new ShopifyError(
      json.errors.map((e: ShopifyGraphQLError) => e.message).join(", ") ||
        `Shopify ${apiName} GraphQL error`,
      {
        status: response.status || 502,
        errors: json.errors,
        responseBody: json,
      }
    );
  }

  if (!json.data) {
    throw new ShopifyError(`Shopify ${apiName} response missing data`, {
      status: response.status || 502,
      responseBody: json,
    });
  }

  return json.data;
}

export async function shopifyStorefrontFetch<T>(
  config: ShopifyConfig,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!config.storeDomain || !config.storefrontAccessToken) {
    throw new ShopifyError("Missing Shopify Storefront configuration", {
      status: 500,
    });
  }

  return shopifyGraphQLFetch<T>(
    `https://${config.storeDomain}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`,
    { "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken },
    query,
    variables,
    "Storefront API"
  );
}

const SHOPIFY_ADMIN_API_VERSION = "2024-01";

export async function shopifyAdminFetch<T>(
  config: ShopifyAdminConfig,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!config.storeDomain || !config.adminAccessToken) {
    throw new ShopifyError("Missing Shopify Admin configuration", {
      status: 500,
    });
  }

  return shopifyGraphQLFetch<T>(
    `https://${config.storeDomain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`,
    { "X-Shopify-Access-Token": config.adminAccessToken },
    query,
    variables,
    "Admin API"
  );
}

// Validate customer access token and get customer info
const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
    }
  }
`;

interface CustomerQueryResponse {
  customer: ShopifyCustomer | null;
}

export async function validateCustomerToken(
  config: ShopifyConfig,
  customerAccessToken: string
): Promise<ShopifyCustomer | null> {
  try {
    const data = await shopifyStorefrontFetch<CustomerQueryResponse>(
      config,
      CUSTOMER_QUERY,
      { customerAccessToken }
    );
    return data.customer;
  } catch {
    return null;
  }
}

// KV key helper
export function getCartKey(customerId: string): string {
  // Extract ID from gid if needed
  const id = customerId.replace("gid://shopify/Customer/", "");
  return `cart:${id}`;
}

// Server-side merge function
export function mergeCarts(
  local: { items: CartItem[] },
  server: StoredCart
): CartItem[] {
  const map = new Map<string, CartItem>();

  // Start from server as base
  for (const item of server.items) {
    map.set(item.merchandiseId, { ...item });
  }

  // Merge local items
  for (const item of local.items) {
    const existing = map.get(item.merchandiseId);

    if (!existing) {
      // Only in local - add it
      map.set(item.merchandiseId, { ...item });
      continue;
    }

    // Both present - last write wins by timestamp
    const localTime = new Date(item.updatedAt).getTime();
    const serverTime = new Date(existing.updatedAt).getTime();

    if (localTime > serverTime) {
      map.set(item.merchandiseId, { ...item });
    }
    // else keep server version (already in map)
  }

  // Filter out deleted items and zero quantity
  return Array.from(map.values()).filter(
    (it) => !it.deleted && it.quantity > 0
  );
}
