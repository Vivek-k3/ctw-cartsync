import { NextRequest, NextResponse } from "next/server";
import {
  shopifyStorefrontFetch,
  ShopifyConfig,
  ShopifyError,
} from "@/lib/shopify";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

function getShopifyConfig(): ShopifyConfig {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!storeDomain || !storefrontAccessToken) {
    console.error("[subscribe] Missing Shopify env vars", {
      hasStoreDomain: Boolean(storeDomain),
      hasStorefrontAccessToken: Boolean(storefrontAccessToken),
    });
    throw new Error("Shopify Storefront configuration not set");
  }

  return { storeDomain, storefrontAccessToken };
}

interface SubscribeBody {
  email: string;
}

// Storefront API mutation - customerEmailMarketingSubscribe
// Requires unauthenticated_write_customers on the Storefront API token
const SUBSCRIBE_MUTATION = `
  mutation customerEmailMarketingSubscribe($email: String!) {
    customerEmailMarketingSubscribe(email: $email) {
      customer {
        email
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  let body: SubscribeBody;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const email = body?.email?.trim().toLowerCase();

  if (!email) {
    return jsonResponse({ error: "email is required" }, 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonResponse({ error: "Invalid email format" }, 400);
  }

  let config: ShopifyConfig;
  try {
    config = getShopifyConfig();
  } catch (err) {
    console.error("/api/subscribe config error", err);
    return jsonResponse({ error: "Service configuration error" }, 500);
  }

  try {
    const result = await shopifyStorefrontFetch<{
      customerEmailMarketingSubscribe: {
        customer: { email: string } | null;
        customerUserErrors: Array<{
          field: string[] | null;
          message: string;
          code: string | null;
        }>;
      };
    }>(config, SUBSCRIBE_MUTATION, { email });

    const errors = result.customerEmailMarketingSubscribe.customerUserErrors ?? [];

    if (result.customerEmailMarketingSubscribe.customer && errors.length === 0) {
      return jsonResponse({
        status: "subscribed",
        email: result.customerEmailMarketingSubscribe.customer.email,
      });
    }

    const alreadySubscribed = errors.some(
      (e) =>
        e.code === "ALREADY_SUBSCRIBED" ||
        e.message.toLowerCase().includes("already")
    );

    if (alreadySubscribed) {
      return jsonResponse({ status: "subscribed", email, note: "already_subscribed" });
    }

    console.error("/api/subscribe userErrors", errors);
    return jsonResponse(
      { error: "Failed to subscribe", details: errors.map((e) => e.message) },
      400
    );
  } catch (err) {
    if (err instanceof ShopifyError) {
      console.error("/api/subscribe ShopifyError", {
        message: err.message,
        status: err.status,
        errors: err.errors,
        responseBody: err.responseBody,
      });
      return jsonResponse({ error: "Failed to subscribe with Shopify" }, 502);
    }

    console.error("/api/subscribe unexpected error", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
