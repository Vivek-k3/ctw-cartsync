import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  validateCustomerToken,
  getCartKey,
  StoredCart,
  CartItem,
  ShopifyConfig,
  mergeCarts,
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
  version?: number; // Client's last known version (for optimistic concurrency)
  forceOverwrite?: boolean; // Skip version check and merge - use client data as-is
}

// OPTIONS /api/cart/sync - CORS preflight
export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// POST /api/cart/sync - Sync cart items with intelligent merge
export async function POST(request: NextRequest) {
  const masterCustomerId = request.headers.get("x-customer-id-master-zero");

  let customerId: string;

  if (masterCustomerId) {
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

  const now = new Date().toISOString();

  // Validate and normalize cart items
  const clientItems: CartItem[] = [];
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

    clientItems.push({
      merchandiseId: item.merchandiseId,
      quantity: item.quantity,
      updatedAt: item.updatedAt || now, // Use client timestamp or current time
      deleted: item.deleted || false,
    });
  }

  const { env } = await getCloudflareContext();
  const cartKey = getCartKey(customerId);

  // Get current server cart
  const serverCart = await env.CARTS_KV.get<StoredCart>(cartKey, "json");
  const serverVersion = serverCart?.version ?? 0;
  const clientVersion = body.version ?? 0;

  let mergedItems: CartItem[];
  let newVersion: number;

  if (body.forceOverwrite) {
    // Force overwrite - no merge, just use client data
    mergedItems = clientItems.filter((it) => !it.deleted && it.quantity > 0);
    newVersion = serverVersion + 1;
  } else if (serverCart && clientVersion !== serverVersion) {
    // Version mismatch - need to merge
    // If client version is older, there were changes on server we need to incorporate
    mergedItems = mergeCarts({ items: clientItems }, serverCart);
    newVersion = serverVersion + 1;

    // Return 409 with merged result so client knows there was a conflict
    // Client should update their local state with this merged result
    const mergedCart: StoredCart = {
      customerId,
      items: mergedItems,
      updatedAt: now,
      version: newVersion,
    };

    await env.CARTS_KV.put(cartKey, JSON.stringify(mergedCart));

    return jsonResponse(
      {
        conflict: true,
        message:
          "Version conflict - cart was modified elsewhere. Merged result returned.",
        cart: mergedCart,
      },
      200 // Return 200 with conflict flag instead of 409 for easier client handling
    );
  } else {
    // Version matches or no server cart - direct update
    mergedItems = clientItems.filter((it) => !it.deleted && it.quantity > 0);
    newVersion = serverVersion + 1;
  }

  const cart: StoredCart = {
    customerId,
    items: mergedItems,
    updatedAt: now,
    version: newVersion,
  };

  await env.CARTS_KV.put(cartKey, JSON.stringify(cart));

  return jsonResponse({ conflict: false, cart });
}
