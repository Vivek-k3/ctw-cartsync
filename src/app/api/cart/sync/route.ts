import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  validateCustomerToken,
  getCartKey,
  StoredCart,
  CartItem,
  ShopifyConfig,
  mergeCarts,
  GuestCart,
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
  guestCart?: GuestCart; // Guest cart to merge on login (sent once when transitioning from guest to logged-in)
  isLoginMerge?: boolean; // Flag indicating this is a login merge operation
}

// Validate and normalize cart items - returns validated items or error string
function validateCartItems(
  items: unknown[],
  now: string
): { items: CartItem[] } | { error: string } {
  const validated: CartItem[] = [];

  for (const item of items) {
    const i = item as Record<string, unknown>;

    if (
      typeof i.merchandiseId !== "string" ||
      !i.merchandiseId.startsWith("gid://shopify/ProductVariant/")
    ) {
      return { error: `Invalid merchandiseId: ${i.merchandiseId}` };
    }

    if (typeof i.quantity !== "number" || i.quantity < 0) {
      return { error: "quantity must be a non-negative number" };
    }

    validated.push({
      merchandiseId: i.merchandiseId,
      quantity: i.quantity,
      updatedAt: (i.updatedAt as string) || now,
      deleted: (i.deleted as boolean) || false,
    });
  }

  return { items: validated };
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
  const clientItemsResult = validateCartItems(body.items, now);
  if ("error" in clientItemsResult) {
    return jsonResponse({ error: clientItemsResult.error }, 400);
  }
  const clientItems = clientItemsResult.items;

  const { env } = await getCloudflareContext();
  const cartKey = getCartKey(customerId);

  // Get current server cart
  const serverCart = await env.CARTS_KV.get<StoredCart>(cartKey, "json");
  const serverVersion = serverCart?.version ?? 0;
  const clientVersion = body.version ?? 0;

  let mergedItems: CartItem[];
  let newVersion: number;

  // Handle login merge: guest cart → account cart
  if (body.isLoginMerge && body.guestCart) {
    const rawGuestItems = body.guestCart.items || [];

    // Validate guest cart items the same way as client items
    if (!Array.isArray(rawGuestItems)) {
      return jsonResponse({ error: "guestCart.items must be an array" }, 400);
    }

    const guestItemsResult = validateCartItems(rawGuestItems, now);
    if ("error" in guestItemsResult) {
      return jsonResponse(
        { error: `Invalid guest cart: ${guestItemsResult.error}` },
        400
      );
    }
    const guestItems = guestItemsResult.items;

    if (serverCart && serverCart.items.length > 0) {
      // Account cart exists - merge guest cart INTO account cart
      // Union: all unique items, last-write-wins for conflicts
      mergedItems = mergeCarts({ items: guestItems }, serverCart);
    } else {
      // No account cart - guest cart becomes account cart
      mergedItems = guestItems.filter((it) => !it.deleted && it.quantity > 0);
    }
    newVersion = serverVersion + 1;

    const mergedCart: StoredCart = {
      customerId,
      items: mergedItems,
      updatedAt: now,
      version: newVersion,
    };

    await env.CARTS_KV.put(cartKey, JSON.stringify(mergedCart));

    return jsonResponse({
      conflict: false,
      merged: true,
      message: "Guest cart merged with account cart",
      cart: mergedCart,
    });
  }

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
