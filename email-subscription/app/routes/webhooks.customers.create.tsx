import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// Admin GraphQL mutation to set email marketing consent
const UPDATE_EMAIL_MARKETING_CONSENT_MUTATION = `
  mutation customerEmailMarketingConsentUpdate(
    $input: CustomerEmailMarketingConsentUpdateInput!
  ) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        email
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // customers/create payload is a Customer object
  // For Admin GraphQL we want the gid customerId, not email.
  const customer = payload as {
    email?: string | null;
    admin_graphql_api_id?: string | null;
  };
  const email = customer.email?.trim().toLowerCase();
  const customerId = customer.admin_graphql_api_id;

  if (!email || !customerId) {
    console.warn(
      "[customers/create] webhook missing email or admin_graphql_api_id, skipping",
      { hasEmail: Boolean(email), hasCustomerId: Boolean(customerId) }
    );
    return new Response();
  }

  if (!session || !session.accessToken) {
    console.warn(
      "[customers/create] webhook without session or accessToken (possibly after uninstall), skipping"
    );
    return new Response();
  }

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/2025-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: UPDATE_EMAIL_MARKETING_CONSENT_MUTATION,
          variables: {
            input: {
              customerId,
              emailMarketingConsent: {
                marketingState: "SUBSCRIBED",
                marketingOptInLevel: "SINGLE_OPT_IN",
              },
            },
          },
        }),
      }
    );

    const json = (await response.json()) as {
      data?: {
        customerEmailMarketingConsentUpdate?: {
          userErrors?: Array<{ field?: string[] | null; message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (!response.ok || json.errors) {
      console.error(
        "[customers/create] Shopify GraphQL error",
        response.status,
        json
      );
      return new Response();
    }

    const userErrors =
      json.data?.customerEmailMarketingConsentUpdate?.userErrors ?? [];

    if (userErrors.length > 0) {
      console.error(
        "[customers/create] userErrors while setting marketing consent",
        userErrors
      );
      // Log error event
      await prisma.subscriptionEvent.create({
        data: {
          shop,
          customerId,
          email,
          source: "webhook",
          status: "error",
          error: userErrors.map((e) => e.message).join("; "),
        },
      }).catch((err) => {
        console.error("[customers/create] Failed to log event", err);
      });
    } else {
      console.log(
        `[customers/create] marketing email SUBSCRIBED for ${email} successfully`
      );
      // Log success event
      await prisma.subscriptionEvent.create({
        data: {
          shop,
          customerId,
          email,
          source: "webhook",
          status: "success",
        },
      }).catch((err) => {
        console.error("[customers/create] Failed to log event", err);
      });
    }
  } catch (err) {
    console.error("[customers/create] failed to update marketing consent", err);
  }

  // Always return 200 so Shopify considers webhook delivered
  return new Response();
}

