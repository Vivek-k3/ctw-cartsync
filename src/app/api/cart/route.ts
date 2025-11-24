import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  validateCustomerToken,
  getCartKey,
  StoredCart,
  ShopifyConfig,
} from "@/lib/shopify";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

// OPTIONS /api/cart - CORS preflight
export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// GET /api/cart - Get cart for authenticated customer
export async function GET(request: NextRequest) {
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

  const { env } = await getCloudflareContext();
  const cartKey = getCartKey(customer.id);
  const cart = await env.CARTS_KV.get<StoredCart>(cartKey, "json");

  if (!cart) {
    return jsonResponse({
      customerId: customer.id,
      items: [],
      updatedAt: null,
    });
  }

  return jsonResponse(cart);
}
