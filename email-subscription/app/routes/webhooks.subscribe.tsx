import type { ActionFunctionArgs } from "react-router";
import prisma from "../db.server";

const GET_CUSTOMER_BY_EMAIL_QUERY = `
  query GetCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      edges {
        node {
          id
          email
        }
      }
    }
  }
`;

const CREATE_CUSTOMER_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
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

type IncomingPayload =
  | {
      email?: string | null;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      message?: string | null;
    }
  | FormData;

async function parsePayload(request: Request): Promise<IncomingPayload> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return (await request.json()) as IncomingPayload;
    } catch {
      return {};
    }
  }

  // Fallback to form-encoded
  const formData = await request.formData();
  return formData;
}

function extractFields(payload: IncomingPayload) {
  if (payload instanceof FormData) {
    const email = (payload.get("email") ?? payload.get("Email")) as
      | string
      | null;
    const name = (payload.get("name") ?? payload.get("Name")) as
      | string
      | null;
    const firstName = (payload.get("firstName") ??
      payload.get("first_name")) as string | null;
    const lastName = (payload.get("lastName") ??
      payload.get("last_name")) as string | null;
    const message = (payload.get("message") ??
      payload.get("Message")) as string | null;

    return { email, name, firstName, lastName, message };
  }

  const { email, name, firstName, lastName, message } = payload;
  return {
    email: email ?? null,
    name: name ?? null,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    message: message ?? null,
  };
}

function splitName(
  name: string | null,
  firstName: string | null,
  lastName: string | null,
) {
  if (firstName || lastName || !name) {
    return { firstName, lastName };
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) ?? null,
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method.toUpperCase() !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Optional simple shared secret to avoid random abuse
  const expectedSecret = process.env.FORM_SUBSCRIBE_SECRET;
  const providedSecret = request.headers.get("x-form-secret");
  if (expectedSecret && expectedSecret !== providedSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rawPayload = await parsePayload(request);
  const { email, name, firstName: rawFirst, lastName: rawLast, message } =
    extractFields(rawPayload);

  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  if (!normalizedEmail) {
    return Response.json(
      { error: "Missing email" },
      { status: 400, statusText: "Bad Request" },
    );
  }

  const { firstName, lastName } = splitName(name, rawFirst, rawLast);

  // Use the first offline session we have (single-shop apps)
  const session = await prisma.session.findFirst({
    where: { isOnline: false },
  });

  if (!session) {
    console.error(
      "[webhooks/subscribe] No offline session found; cannot call Admin API",
    );
    return Response.json(
      { error: "Shop not initialized" },
      { status: 500, statusText: "Internal Server Error" },
    );
  }

  const shop = session.shop;
  const accessToken = session.accessToken;

  try {
    // 1) Look up existing customer by email
    const lookupResponse = await fetch(
      `https://${shop}/admin/api/2025-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: GET_CUSTOMER_BY_EMAIL_QUERY,
          variables: {
            query: `email:${normalizedEmail}`,
          },
        }),
      },
    );

    const lookupJson = (await lookupResponse.json()) as {
      data?: {
        customers?: {
          edges?: Array<{ node: { id: string; email: string | null } }>;
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (!lookupResponse.ok || lookupJson.errors) {
      console.error(
        "[webhooks/subscribe] Error querying customer by email",
        lookupResponse.status,
        lookupJson,
      );
      return Response.json(
        { error: "Failed to query customer" },
        { status: 500, statusText: "Internal Server Error" },
      );
    }

    let customerId: string | null =
      lookupJson.data?.customers?.edges?.[0]?.node.id ?? null;

    // 2) If customer does not exist, create it
    if (!customerId) {
      const createResponse = await fetch(
        `https://${shop}/admin/api/2025-10/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
          },
          body: JSON.stringify({
            query: CREATE_CUSTOMER_MUTATION,
            variables: {
              input: {
                email: normalizedEmail,
                firstName: firstName ?? undefined,
                lastName: lastName ?? undefined,
              },
            },
          }),
        },
      );

      const createJson = (await createResponse.json()) as {
        data?: {
          customerCreate?: {
            customer?: { id: string; email: string | null } | null;
            userErrors?: Array<{
              field?: string[] | null;
              message: string;
            }>;
          };
        };
        errors?: Array<{ message: string }>;
      };

      if (!createResponse.ok || createJson.errors) {
        console.error(
          "[webhooks/subscribe] Error creating customer",
          createResponse.status,
          createJson,
        );
        return Response.json(
          { error: "Failed to create customer" },
          { status: 500, statusText: "Internal Server Error" },
        );
      }

      const userErrors =
        createJson.data?.customerCreate?.userErrors ?? ([] as Array<{
          field?: string[] | null;
          message: string;
        }>);

      if (userErrors.length > 0) {
        console.error(
          "[webhooks/subscribe] userErrors while creating customer",
          userErrors,
        );
        return Response.json(
          { error: "Failed to create customer", details: userErrors },
          { status: 400, statusText: "Bad Request" },
        );
      }

      customerId = createJson.data?.customerCreate?.customer?.id ?? null;
    }

    if (!customerId) {
      console.error(
        "[webhooks/subscribe] Missing customerId after create / lookup",
      );
      return Response.json(
        { error: "Unable to resolve customer" },
        { status: 500, statusText: "Internal Server Error" },
      );
    }

    // 3) Ensure email marketing consent is SUBSCRIBED
    const consentResponse = await fetch(
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
      },
    );

    const consentJson = (await consentResponse.json()) as {
      data?: {
        customerEmailMarketingConsentUpdate?: {
          userErrors?: Array<{ field?: string[] | null; message: string }>;
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (!consentResponse.ok || consentJson.errors) {
      console.error(
        "[webhooks/subscribe] Error updating email marketing consent",
        consentResponse.status,
        consentJson,
      );
      return Response.json(
        { error: "Failed to update subscription" },
        { status: 500, statusText: "Internal Server Error" },
      );
    }

    const consentUserErrors =
      consentJson.data?.customerEmailMarketingConsentUpdate?.userErrors ??
      [];

    if (consentUserErrors.length > 0) {
      console.error(
        "[webhooks/subscribe] userErrors while setting marketing consent",
        consentUserErrors,
      );
      return Response.json(
        { error: "Failed to update subscription", details: consentUserErrors },
        { status: 400, statusText: "Bad Request" },
      );
    }

    if (message) {
      console.log(
        "[webhooks/subscribe] Received message with subscription request",
        {
          email: normalizedEmail,
          firstName,
          lastName,
          message,
        },
      );
    }

    return Response.json({
      ok: true,
      email: normalizedEmail,
      customerId,
    });
  } catch (err) {
    console.error("[webhooks/subscribe] Unexpected error", err);
    return Response.json(
      { error: "Unexpected error" },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
};

