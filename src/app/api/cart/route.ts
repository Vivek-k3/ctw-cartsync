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

// OPTIONS /api/cart - CORS preflight
export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// GET /api/cart - Get cart for authenticated customer
export async function GET(request: NextRequest) {
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

  const { env } = await getCloudflareContext();
  const cartKey = getCartKey(customerId);
  const cart = await env.CARTS_KV.get<StoredCart>(cartKey, "json");

  if (!cart) {
    // Return empty cart with version 0
    return jsonResponse({
      customerId,
      items: [],
      updatedAt: null,
      version: 0,
    });
  }

  return jsonResponse(cart);
}
