import { useEffect } from "react";
import type {
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import prisma from "../db.server";

const GET_SUBSCRIBED_COUNT_QUERY = `
  query GetSubscribedCount {
    customers(first: 1, query: "email_marketing_consent_marketing_state:SUBSCRIBED") {
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const GET_RECENT_CUSTOMERS_QUERY = `
  query GetRecentCustomers {
    customers(first: 10, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          email
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
          }
          createdAt
        }
      }
    }
  }
`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  // Get subscription stats from database
  const [totalSubscriptions, recentEvents, todaySubscriptions, thisWeekSubscriptions] = await Promise.all([
    prisma.subscriptionEvent.count({
      where: { shop, status: "success" },
    }),
    prisma.subscriptionEvent.findMany({
      where: { shop },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.subscriptionEvent.count({
      where: {
        shop,
        status: "success",
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.subscriptionEvent.count({
      where: {
        shop,
        status: "success",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  // Get total subscribed customers from Shopify
  let totalSubscribedCustomers = 0;
  try {
    const countResponse = await admin.graphql(GET_SUBSCRIBED_COUNT_QUERY);
    const countJson = await countResponse.json();
    // Note: Shopify doesn't return exact count, we'd need to paginate
    // For now, we'll use our database count as approximation
  } catch (err) {
    console.error("Failed to fetch customer count", err);
  }

  // Get recent customers
  let recentCustomers: Array<{
    id: string;
    email: string | null;
    emailMarketingConsent: {
      marketingState: string;
      marketingOptInLevel: string;
    } | null;
    createdAt: string;
  }> = [];

  try {
    const customersResponse = await admin.graphql(GET_RECENT_CUSTOMERS_QUERY);
    const customersJson = await customersResponse.json();
    recentCustomers =
      customersJson.data?.customers?.edges?.map((edge: any) => edge.node) ?? [];
  } catch (err) {
    console.error("Failed to fetch recent customers", err);
  }

  return {
    totalSubscriptions,
    todaySubscriptions,
    thisWeekSubscriptions,
    recentEvents,
    recentCustomers,
  };
};

export default function Index() {
  const shopify = useAppBridge();
  const {
    totalSubscriptions,
    todaySubscriptions,
    thisWeekSubscriptions,
    recentEvents,
    recentCustomers,
  } = useLoaderData<typeof loader>();

  const errorCount = recentEvents.filter((e) => e.status === "error").length;
  const successRate =
    recentEvents.length > 0
      ? ((recentEvents.length - errorCount) / recentEvents.length) * 100
      : 100;

  return (
    <s-page heading="Email Subscription Dashboard">
      <s-section>
        <s-stack direction="block" gap="large">
          {/* Stats Cards */}
          <s-stack direction="inline" gap="base">
            <s-box
              padding="large"
              borderWidth="base"
              borderRadius="base"
              background="surface"
              minWidth="200px"
            >
              <s-stack direction="block" gap="tight">
                <s-text tone="subdued" size="small">
                  Total Subscriptions
                </s-text>
                <s-heading size="large">{totalSubscriptions.toLocaleString()}</s-heading>
              </s-stack>
            </s-box>

            <s-box
              padding="large"
              borderWidth="base"
              borderRadius="base"
              background="surface"
              minWidth="200px"
            >
              <s-stack direction="block" gap="tight">
                <s-text tone="subdued" size="small">
                  Today
                </s-text>
                <s-heading size="large">{todaySubscriptions.toLocaleString()}</s-heading>
              </s-stack>
            </s-box>

            <s-box
              padding="large"
              borderWidth="base"
              borderRadius="base"
              background="surface"
              minWidth="200px"
            >
              <s-stack direction="block" gap="tight">
                <s-text tone="subdued" size="small">
                  This Week
                </s-text>
                <s-heading size="large">{thisWeekSubscriptions.toLocaleString()}</s-heading>
              </s-stack>
            </s-box>

            <s-box
              padding="large"
              borderWidth="base"
              borderRadius="base"
              background="surface"
              minWidth="200px"
            >
              <s-stack direction="block" gap="tight">
                <s-text tone="subdued" size="small">
                  Success Rate
                </s-text>
                <s-heading size="large">
                  {successRate.toFixed(1)}%
                </s-heading>
              </s-stack>
            </s-box>
          </s-stack>

          {/* Recent Activity */}
          <s-section heading="Recent Activity">
            {recentEvents.length === 0 ? (
              <s-paragraph tone="subdued">
                No subscription events yet. Events will appear here as customers are subscribed.
              </s-paragraph>
            ) : (
              <s-box
                padding="base"
                borderWidth="base"
                borderRadius="base"
                background="subdued"
              >
                <s-stack direction="block" gap="tight">
                  {recentEvents.slice(0, 5).map((event) => (
                    <s-box
                      key={event.id}
                      padding="base"
                      background="surface"
                      borderRadius="tight"
                    >
                      <s-stack direction="inline" gap="base" align="space-between">
                        <s-stack direction="block" gap="extra-tight">
                          <s-text emphasis>{event.email}</s-text>
                          <s-text tone="subdued" size="small">
                            {event.source} • {new Date(event.createdAt).toLocaleString()}
                          </s-text>
                        </s-stack>
                        <s-badge
                          tone={event.status === "success" ? "success" : "critical"}
                        >
                          {event.status}
                        </s-badge>
                      </s-stack>
                    </s-box>
                  ))}
                </s-stack>
              </s-box>
            )}
            {recentEvents.length > 5 && (
              <s-link href="/app/activity">View all activity →</s-link>
            )}
          </s-section>

          {/* Recent Customers */}
          <s-section heading="Recent Customers">
            {recentCustomers.length === 0 ? (
              <s-paragraph tone="subdued">No customers found.</s-paragraph>
            ) : (
              <s-box
                padding="base"
                borderWidth="base"
                borderRadius="base"
                background="subdued"
              >
                <s-stack direction="block" gap="tight">
                  {recentCustomers.slice(0, 5).map((customer) => (
                    <s-box
                      key={customer.id}
                      padding="base"
                      background="surface"
                      borderRadius="tight"
                    >
                      <s-stack direction="inline" gap="base" align="space-between">
                        <s-stack direction="block" gap="extra-tight">
                          <s-text emphasis>{customer.email || "No email"}</s-text>
                          <s-text tone="subdued" size="small">
                            Created {new Date(customer.createdAt).toLocaleString()}
                          </s-text>
                        </s-stack>
                        <s-badge
                          tone={
                            customer.emailMarketingConsent?.marketingState ===
                            "SUBSCRIBED"
                              ? "success"
                              : "subdued"
                          }
                        >
                          {customer.emailMarketingConsent?.marketingState ||
                            "UNKNOWN"}
                        </s-badge>
                      </s-stack>
                    </s-box>
                  ))}
                </s-stack>
              </s-box>
            )}
          </s-section>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Quick Actions">
        <s-stack direction="block" gap="base">
          <s-link href="/app/backfill-subscriptions">
            <s-button variant="secondary" fullWidth>
              Backfill Subscriptions
            </s-button>
          </s-link>
          <s-link href="/app/activity">
            <s-button variant="secondary" fullWidth>
              View Activity Log
            </s-button>
          </s-link>
          <s-link href="/app/settings">
            <s-button variant="secondary" fullWidth>
              App Settings
            </s-button>
          </s-link>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="How it works">
        <s-paragraph size="small">
          This app automatically subscribes customers to email marketing when:
        </s-paragraph>
        <s-unordered-list size="small">
          <s-list-item>New customers are created (via webhook)</s-list-item>
          <s-list-item>Forms submit to /webhooks/subscribe</s-list-item>
          <s-list-item>You run the backfill tool</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
