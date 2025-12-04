import type {
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const status = url.searchParams.get("status");
  const perPage = 50;
  const skip = (page - 1) * perPage;

  const where: any = { shop };
  if (status) {
    where.status = status;
  }

  const [events, totalCount] = await Promise.all([
    prisma.subscriptionEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.subscriptionEvent.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return {
    events,
    pagination: {
      page,
      perPage,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export default function ActivityPage() {
  const { events, pagination } = useLoaderData<typeof loader>();

  return (
    <s-page heading="Activity Log">
      <s-section>
        <s-stack direction="block" gap="base">
          <s-stack direction="inline" gap="base" align="space-between">
            <s-text>
              Showing {events.length} of {pagination.totalCount} events
            </s-text>
            {pagination.totalPages > 1 && (
              <s-stack direction="inline" gap="tight">
                {pagination.hasPrev && (
                  <s-link href={`/app/activity?page=${pagination.page - 1}`}>
                    <s-button variant="tertiary" size="small">
                      Previous
                    </s-button>
                  </s-link>
                )}
                <s-text tone="subdued" size="small">
                  Page {pagination.page} of {pagination.totalPages}
                </s-text>
                {pagination.hasNext && (
                  <s-link href={`/app/activity?page=${pagination.page + 1}`}>
                    <s-button variant="tertiary" size="small">
                      Next
                    </s-button>
                  </s-link>
                )}
              </s-stack>
            )}
          </s-stack>

          {events.length === 0 ? (
            <s-box
              padding="large"
              borderWidth="base"
              borderRadius="base"
              background="subdued"
            >
              <s-text tone="subdued" align="center">
                No activity yet. Events will appear here as subscriptions are processed.
              </s-text>
            </s-box>
          ) : (
            <s-box
              padding="base"
              borderWidth="base"
              borderRadius="base"
              background="subdued"
            >
              <s-stack direction="block" gap="tight">
                {events.map((event) => (
                  <s-box
                    key={event.id}
                    padding="base"
                    background="surface"
                    borderRadius="tight"
                    borderWidth="base"
                  >
                    <s-stack direction="block" gap="tight">
                      <s-stack direction="inline" gap="base" align="space-between">
                        <s-stack direction="block" gap="extra-tight">
                          <s-text emphasis size="medium">
                            {event.email}
                          </s-text>
                          <s-text tone="subdued" size="small">
                            {new Date(event.createdAt).toLocaleString()}
                          </s-text>
                        </s-stack>
                        <s-stack direction="inline" gap="base">
                          <s-badge tone={event.status === "success" ? "success" : "critical"}>
                            {event.status}
                          </s-badge>
                          <s-badge tone="subdued">{event.source}</s-badge>
                        </s-stack>
                      </s-stack>
                      {event.error && (
                        <s-box
                          padding="tight"
                          background="critical-subdued"
                          borderRadius="tight"
                        >
                          <s-text tone="critical" size="small">
                            {event.error}
                          </s-text>
                        </s-box>
                      )}
                      {event.metadata && (
                        <s-details>
                          <s-summary>
                            <s-text size="small">View details</s-text>
                          </s-summary>
                          <s-box
                            padding="tight"
                            background="subdued"
                            borderRadius="tight"
                            marginBlockStart="tight"
                          >
                            <pre style={{ margin: 0, fontSize: "0.875rem" }}>
                              <code>{event.metadata}</code>
                            </pre>
                          </s-box>
                        </s-details>
                      )}
                    </s-stack>
                  </s-box>
                ))}
              </s-stack>
            </s-box>
          )}
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Filter by">
        <s-stack direction="block" gap="base">
          <s-link href="/app/activity">
            <s-button variant="secondary" fullWidth>
              All Events
            </s-button>
          </s-link>
          <s-link href="/app/activity?status=success">
            <s-button variant="secondary" fullWidth>
              Success Only
            </s-button>
          </s-link>
          <s-link href="/app/activity?status=error">
            <s-button variant="secondary" fullWidth>
              Errors Only
            </s-button>
          </s-link>
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

