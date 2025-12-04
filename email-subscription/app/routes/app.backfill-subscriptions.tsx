import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useAppBridge } from "@shopify/app-bridge-react";

const LIST_UNSUBSCRIBED_QUERY = `
  query UnsubscribedCustomers($cursor: String) {
    customers(
      first: 50
      after: $cursor
      query: "email_marketing_consent_marketing_state:NOT_SUBSCRIBED OR email_marketing_consent_marketing_state:NOT_COLLECTED"
    ) {
      edges {
        cursor
        node {
          id
          email
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const UPDATE_EMAIL_MARKETING_CONSENT_MUTATION = `
  mutation customerEmailMarketingConsentUpdate(
    $input: CustomerEmailMarketingConsentUpdateInput!
  ) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        email
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  let updatedCount = 0;
  let cursor: string | null = null;
  let iterations = 0;

  // Hard cap to avoid runaway jobs
  const MAX_ITERATIONS = 50;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (iterations++ >= MAX_ITERATIONS) {
      break;
    }

    const response = await admin.graphql(
      `#graphql
      ${LIST_UNSUBSCRIBED_QUERY}
    `,
      {
        variables: { cursor },
      },
    );

    const json = (await response.json()) as {
      data: {
        customers: {
          edges: Array<{
            cursor: string;
            node: { id: string; email: string | null };
          }>;
          pageInfo: { hasNextPage: boolean };
        };
      };
    };

    const edges = json.data.customers.edges;

    if (edges.length === 0) {
      break;
    }

    for (const edge of edges) {
      cursor = edge.cursor;
      const { id, email } = edge.node;

      if (!email) continue;

      const updateResponse = await admin.graphql(
        `#graphql
        ${UPDATE_EMAIL_MARKETING_CONSENT_MUTATION}
      `,
        {
          variables: {
            input: {
              customerId: id,
              emailMarketingConsent: {
                marketingState: "SUBSCRIBED",
                marketingOptInLevel: "SINGLE_OPT_IN",
              },
            },
          },
        },
      );

      const updateJson = (await updateResponse.json()) as {
        data: {
          customerEmailMarketingConsentUpdate: {
            userErrors: Array<{ field?: string[] | null; message: string }>;
          };
        };
      };

      const userErrors =
        updateJson.data.customerEmailMarketingConsentUpdate.userErrors;

      if (userErrors.length > 0) {
        console.error(
          "[backfill-subscriptions] userErrors for",
          id,
          email,
          userErrors,
        );
        continue;
      }

      updatedCount += 1;
    }

    if (!json.data.customers.pageInfo.hasNextPage) {
      break;
    }
  }

  return { updatedCount };
};

export default function BackfillSubscriptionsPage() {
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const isRunning =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.updatedCount != null) {
      shopify.toast.show(
        `Backfill complete: ${fetcher.data.updatedCount} customers updated`,
      );
    }
  }, [fetcher.data?.updatedCount, shopify]);

  return (
    <s-page heading="Backfill email subscriptions">
      <s-section>
        <s-paragraph>
          This tool scans existing customers whose{" "}
          <s-code>emailMarketingConsent.marketingState</s-code> is{" "}
          <s-code>NOT_SUBSCRIBED</s-code> or{" "}
          <s-code>NOT_COLLECTED</s-code> and updates them to{" "}
          <s-code>SUBSCRIBED</s-code> with{" "}
          <s-code>marketingOptInLevel = SINGLE_OPT_IN</s-code>.
        </s-paragraph>
        <s-paragraph tone="critical">
          This is a bulk change and may have legal/consent implications. Make
          sure you&apos;re allowed to auto-subscribe these customers before
          running it.
        </s-paragraph>
      </s-section>

      <s-section heading="Run backfill">
        <fetcher.Form method="post">
          <s-stack direction="inline" gap="base">
            <s-button
              variant="primary"
              type="submit"
              {...(isRunning ? { loading: true } : {})}
            >
              Backfill existing customers
            </s-button>
            {fetcher.data?.updatedCount != null && !isRunning && (
              <s-text>
                Updated{" "}
                <s-text emphasis>{fetcher.data.updatedCount}</s-text>{" "}
                customers in the last run.
              </s-text>
            )}
          </s-stack>
        </fetcher.Form>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

