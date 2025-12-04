import { useState } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    formSecret: process.env.FORM_SUBSCRIBE_SECRET || "",
    shopDomain: process.env.SHOPIFY_FORM_SHOP_DOMAIN || "",
    adminToken: process.env.SHOPIFY_FORM_ADMIN_TOKEN ? "***" : "",
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "test-webhook") {
    // Test the webhook endpoint
    const formSecret = process.env.FORM_SUBSCRIBE_SECRET;
    const testEmail = formData.get("testEmail") as string;

    if (!testEmail) {
      return { error: "Test email is required" };
    }

    try {
      const response = await fetch(
        `${new URL(request.url).origin}/webhooks/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(formSecret ? { "x-form-secret": formSecret } : {}),
          },
          body: JSON.stringify({ email: testEmail }),
        },
      );

      const result = await response.json();
      return {
        success: response.ok,
        result,
        status: response.status,
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  return { error: "Unknown action" };
};

export default function SettingsPage() {
  const shopify = useAppBridge();
  const fetcher = useFetcher<typeof action>();
  const { formSecret, shopDomain, adminToken } = useLoaderData<typeof loader>();
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.error) {
        shopify.toast.show(`Error: ${fetcher.data.error}`, { isError: true });
      } else if (fetcher.data.success) {
        shopify.toast.show("Test subscription successful!");
      } else {
        shopify.toast.show("Test subscription failed", { isError: true });
      }
    }
  }, [fetcher.data, shopify]);

  const isTesting = fetcher.state === "submitting";

  return (
    <s-page heading="App Settings">
      <s-section heading="Configuration">
        <s-stack direction="block" gap="large">
          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="base">
              <s-heading size="small">Environment Variables</s-heading>
              <s-paragraph tone="subdued" size="small">
                These settings are configured via environment variables. Update
                them in your deployment environment.
              </s-paragraph>

              <s-stack direction="block" gap="tight">
                <s-text emphasis size="small">FORM_SUBSCRIBE_SECRET</s-text>
                <s-text tone="subdued" size="small">
                  {formSecret ? "✓ Set" : "✗ Not set (optional)"}
                </s-text>
                <s-text tone="subdued" size="small">
                  Optional secret for form submission authentication
                </s-text>
              </s-stack>

              <s-stack direction="block" gap="tight">
                <s-text emphasis size="small">
                  SHOPIFY_FORM_SHOP_DOMAIN
                </s-text>
                <s-text tone="subdued" size="small">
                  {shopDomain ? `✓ ${shopDomain}` : "✗ Not set (uses session)"}
                </s-text>
                <s-text tone="subdued" size="small">
                  Shop domain for form submissions (falls back to session if not set)
                </s-text>
              </s-stack>

              <s-stack direction="block" gap="tight">
                <s-text emphasis size="small">
                  SHOPIFY_FORM_ADMIN_TOKEN
                </s-text>
                <s-text tone="subdued" size="small">
                  {adminToken ? "✓ Set" : "✗ Not set (uses session)"}
                </s-text>
                <s-text tone="subdued" size="small">
                  Admin API token for form submissions (falls back to session if not set)
                </s-text>
              </s-stack>
            </s-stack>
          </s-box>

          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="base">
              <s-heading size="small">Webhook Endpoint</s-heading>
              <s-paragraph tone="subdued" size="small">
                Use this endpoint to subscribe customers via form submissions or
                API calls.
              </s-paragraph>
              <s-box
                padding="tight"
                background="surface"
                borderRadius="tight"
              >
                <s-code size="small">
                  POST {typeof window !== "undefined" ? window.location.origin : ""}
                  /webhooks/subscribe
                </s-code>
              </s-box>
              <s-paragraph tone="subdued" size="small">
                <s-text emphasis>Body:</s-text> JSON with <s-code>email</s-code>{" "}
                (required), <s-code>firstName</s-code>, <s-code>lastName</s-code>,{" "}
                <s-code>name</s-code>, or <s-code>message</s-code>
              </s-paragraph>
              <s-paragraph tone="subdued" size="small">
                <s-text emphasis>Headers:</s-text>{" "}
                {formSecret ? (
                  <>
                    <s-code>x-form-secret</s-code> (if FORM_SUBSCRIBE_SECRET is set)
                  </>
                ) : (
                  "No authentication required"
                )}
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Test Subscription">
        <s-stack direction="block" gap="base">
          <s-paragraph tone="subdued" size="small">
            Test the subscription endpoint with a sample email address.
          </s-paragraph>
          <fetcher.Form method="post">
            <input type="hidden" name="action" value="test-webhook" />
            <s-stack direction="block" gap="base">
              <s-stack direction="block" gap="tight">
                <s-text size="small" emphasis>
                  Test Email
                </s-text>
                <input
                  type="email"
                  name="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  required
                  style={{
                    padding: "0.5rem",
                    border: "1px solid var(--p-border-subdued)",
                    borderRadius: "0.25rem",
                    width: "100%",
                  }}
                />
              </s-stack>
              <s-button
                type="submit"
                variant="primary"
                {...(isTesting ? { loading: true } : {})}
              >
                Test Subscription
              </s-button>
            </s-stack>
          </fetcher.Form>
          {fetcher.data && !fetcher.data.error && fetcher.data.result && (
            <s-box
              padding="base"
              background="success-subdued"
              borderRadius="base"
              marginBlockStart="base"
            >
              <s-text tone="success" size="small">
                Response: {JSON.stringify(fetcher.data.result, null, 2)}
              </s-text>
            </s-box>
          )}
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Features">
        <s-unordered-list size="small">
          <s-list-item>Auto-subscribe new customers</s-list-item>
          <s-list-item>Form submission endpoint</s-list-item>
          <s-list-item>Bulk backfill tool</s-list-item>
          <s-list-item>Activity logging</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Documentation">
        <s-link
          href="https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerEmailMarketingConsentUpdate"
          target="_blank"
        >
          <s-button variant="tertiary" fullWidth>
            API Reference
          </s-button>
        </s-link>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

