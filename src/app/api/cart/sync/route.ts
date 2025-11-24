import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  validateCustomerToken,
  getCartKey,
  StoredCart,
  CartItem,
  ShopifyConfig,
} from "@/lib/shopify";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-customer-id-master-zero",
};

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

function getShopifyConfig(): ShopifyConfig {
  return {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  };
}

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

interface SyncCartBody {
  items: CartItem[];
}

// OPTIONS /api/cart/sync - CORS preflight
export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// POST /api/cart/sync - Sync cart items for authenticated customer
export async function POST(request: NextRequest) {
  const masterCustomerId = request.headers.get("x-customer-id-master-zero");

  let customerId: string;

  if (masterCustomerId) {
    // Master bypass - use customer ID directly without token validation
    customerId = masterCustomerId;
  } else {
    const customerAccessToken = extractBearerToken(request);

    if (!customerAccessToken) {
      return jsonResponse(
        { error: "Missing or invalid Authorization header" },
        401
      );
    }

    const config = getShopifyConfig();
    const customer = await validateCustomerToken(config, customerAccessToken);

    if (!customer) {
      return jsonResponse({ error: "Invalid customer access token" }, 401);
    }

    customerId = customer.id;
  }

  let body: SyncCartBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!Array.isArray(body.items)) {
    return jsonResponse({ error: "items must be an array" }, 400);
  }

  // Validate cart items
  for (const item of body.items) {
    if (
      typeof item.merchandiseId !== "string" ||
      !item.merchandiseId.startsWith("gid://shopify/ProductVariant/")
    ) {
      return jsonResponse(
        { error: `Invalid merchandiseId: ${item.merchandiseId}` },
        400
      );
    }
    if (typeof item.quantity !== "number" || item.quantity < 0) {
      return jsonResponse(
        { error: "quantity must be a non-negative number" },
        400
      );
    }
  }

  // Filter out zero-quantity items
  const filteredItems = body.items.filter((item) => item.quantity > 0);

  const cart: StoredCart = {
    customerId,
    items: filteredItems,
    updatedAt: new Date().toISOString(),
  };

  const { env } = await getCloudflareContext();
  const cartKey = getCartKey(customerId);
  await env.CARTS_KV.put(cartKey, JSON.stringify(cart));

  return jsonResponse(cart);
}
