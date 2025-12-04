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

// Validate cart items - returns validated items or error string
// Note: updatedAt is optional - server will assign timestamps based on actual changes
function validateCartItems(
  items: unknown[]
): { items: Array<{ merchandiseId: string; quantity: number; updatedAt?: string; deleted?: boolean }> } | { error: string } {
  const validated: Array<{ merchandiseId: string; quantity: number; updatedAt?: string; deleted?: boolean }> = [];

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
      updatedAt: i.updatedAt as string | undefined,
      deleted: (i.deleted as boolean) || false,
    });
  }

  return { items: validated };
}

// Apply timestamps based on actual changes (last action wins)
// - New items get current timestamp
// - Changed items (quantity different) get current timestamp
// - Unchanged items keep their existing server timestamp
function applyTimestamps(
  clientItems: Array<{ merchandiseId: string; quantity: number; updatedAt?: string; deleted?: boolean }>,
  serverItems: CartItem[] | undefined,
  now: string
): CartItem[] {
  const serverMap = new Map<string, CartItem>();
  for (const item of serverItems || []) {
    serverMap.set(item.merchandiseId, item);
  }

  return clientItems.map((clientItem) => {
    const serverItem = serverMap.get(clientItem.merchandiseId);

    // If client provided a timestamp (e.g., guest cart items), use it
    if (clientItem.updatedAt) {
      return {
        merchandiseId: clientItem.merchandiseId,
        quantity: clientItem.quantity,
        updatedAt: clientItem.updatedAt,
        deleted: clientItem.deleted || false,
      };
    }

    // New item or quantity changed → use server's current time (this is the "action" time)
    if (!serverItem || serverItem.quantity !== clientItem.quantity) {
      return {
        merchandiseId: clientItem.merchandiseId,
        quantity: clientItem.quantity,
        updatedAt: now,
        deleted: clientItem.deleted || false,
      };
    }

    // Item unchanged → keep server's existing timestamp
    return {
      merchandiseId: clientItem.merchandiseId,
      quantity: clientItem.quantity,
      updatedAt: serverItem.updatedAt,
      deleted: clientItem.deleted || false,
    };
  });
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

  // Validate cart items (timestamps are optional - server assigns based on changes)
  const clientItemsResult = validateCartItems(body.items);
  if ("error" in clientItemsResult) {
    return jsonResponse({ error: clientItemsResult.error }, 400);
  }
  const rawClientItems = clientItemsResult.items;

  const { env } = await getCloudflareContext();
  const cartKey = getCartKey(customerId);

  // Get current server cart
  const serverCart = await env.CARTS_KV.get<StoredCart>(cartKey, "json");
  const serverVersion = serverCart?.version ?? 0;
  const clientVersion = body.version ?? 0;

  let mergedItems: CartItem[];
  let newVersion: number;

  // Handle login merge: guest cart → account cart
  // Guest cart items have real timestamps from when user added them
  if (body.isLoginMerge && body.guestCart) {
    const rawGuestItems = body.guestCart.items || [];

    if (!Array.isArray(rawGuestItems)) {
      return jsonResponse({ error: "guestCart.items must be an array" }, 400);
    }

    const guestItemsResult = validateCartItems(rawGuestItems);
    if ("error" in guestItemsResult) {
      return jsonResponse(
        { error: `Invalid guest cart: ${guestItemsResult.error}` },
        400
      );
    }

    // Guest cart items should have timestamps - apply server time if missing
    const guestItems: CartItem[] = guestItemsResult.items.map((item) => ({
      merchandiseId: item.merchandiseId,
      quantity: item.quantity,
      updatedAt: item.updatedAt || now,
      deleted: item.deleted || false,
    }));

    if (serverCart && serverCart.items.length > 0) {
      // Account cart exists - merge guest cart INTO account cart
      // Union: all unique items, last-write-wins by timestamp
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

  // Apply timestamps based on actual changes
  // - New items / changed quantities → server's current time (action time)
  // - Unchanged items → keep existing server timestamp
  const clientItems = applyTimestamps(rawClientItems, serverCart?.items, now);

  if (body.forceOverwrite) {
    // Force overwrite - no merge, just use client data
    mergedItems = clientItems.filter((it) => !it.deleted && it.quantity > 0);
    newVersion = serverVersion + 1;
  } else if (serverCart && clientVersion !== serverVersion) {
    // Version mismatch - need to merge using timestamps
    // Last action wins based on updatedAt timestamp
    mergedItems = mergeCarts({ items: clientItems }, serverCart);
    newVersion = serverVersion + 1;

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
      200
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
