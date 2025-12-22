import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  PaymentTransaction,
  PaginatedPaymentTransactionsResponse,
} from "@/types/payment-transaction";

/**
 * Get payment transactions for a specific customer.
 * Fetches from GET /admin/payments/transactions with customer_id filter.
 */
export async function getCustomerPaymentTransactions(
  customerId: string,
  jwt: string,
  pagination: { limit?: number; offset?: number } = {}
): Promise<PaginatedPaymentTransactionsResponse> {
  if (!customerId) {
    return { data: [], total: 0, limit: 10, offset: 0 };
  }

  if (!jwt) {
    throw new Error(
      "Authentication token is required to fetch payment transactions."
    );
  }

  const sanitizedLimit =
    typeof pagination.limit === "number" && Number.isFinite(pagination.limit)
      ? Math.max(1, Math.floor(pagination.limit))
      : 10;

  const sanitizedOffset =
    typeof pagination.offset === "number" && Number.isFinite(pagination.offset)
      ? Math.max(0, Math.floor(pagination.offset))
      : 0;

  const url = new URL(`${getValue("API")}admin/payments/transactions`);
  url.searchParams.set("customer_id", customerId);
  url.searchParams.set("limit", String(sanitizedLimit));
  url.searchParams.set("offset", String(sanitizedOffset));

  console.log("[Payment Service] Fetching transactions with JWT:", jwt);

  const response = await fetch(url.toString(), {
    method: "GET",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    // 404 means no transactions exist - return empty result
    if (response.status === 404) {
      return {
        data: [],
        total: 0,
        limit: sanitizedLimit,
        offset: sanitizedOffset,
      };
    }

    throw new Error(
      `Failed to fetch payment transactions: ${response.status} ${response.statusText}`
    );
  }

  const payload = await response.json();

  // Handle array response (list of transactions)
  if (Array.isArray(payload)) {
    return {
      data: payload as PaymentTransaction[],
      total: payload.length,
      limit: sanitizedLimit,
      offset: sanitizedOffset,
    };
  }

  // Handle object response with data array
  if (payload && typeof payload === "object") {
    const transactions = payload.data || payload.transactions || [];
    return {
      data: Array.isArray(transactions)
        ? (transactions as PaymentTransaction[])
        : [],
      total: payload.total ?? transactions.length ?? 0,
      limit: payload.limit ?? sanitizedLimit,
      offset: payload.offset ?? sanitizedOffset,
    };
  }

  return {
    data: [],
    total: 0,
    limit: sanitizedLimit,
    offset: sanitizedOffset,
  };
}
