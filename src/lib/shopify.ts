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

export async function shopifyStorefrontFetch<T>(
  config: ShopifyConfig,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(
    `https://${config.storeDomain}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data as T;
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
