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
}

export interface StoredCart {
  customerId: string; // gid://shopify/Customer/xxx
  items: CartItem[];
  updatedAt: string; // ISO datetime
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

