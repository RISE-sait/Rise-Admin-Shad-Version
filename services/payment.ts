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


  // Helper to extract URL string from various formats
  // Handles PostgreSQL nullable format: { "String": "...", "Valid": true }
  const extractUrl = (value: unknown): string | null => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      const obj = value as Record<string, unknown>;
      // Handle PostgreSQL nullable string format
      if (obj.Valid === true && typeof obj.String === "string" && obj.String !== "") {
        return obj.String;
      }
      // Handle other nested formats
      if (typeof obj.url === "string") return obj.url;
      if (typeof obj.href === "string") return obj.href;
      if (typeof obj.link === "string") return obj.link;
    }
    return null;
  };

  // Normalize a transaction to ensure URL fields are strings
  // Check both snake_case and camelCase field names
  const normalizeTransaction = (tx: Record<string, unknown>): PaymentTransaction => ({
    id: String(tx.id || ""),
    customer_email: String(tx.customer_email || tx.customerEmail || ""),
    customer_name: String(tx.customer_name || tx.customerName || ""),
    transaction_type: String(tx.transaction_type || tx.transactionType || "") as PaymentTransaction["transaction_type"],
    transaction_date: String(tx.transaction_date || tx.transactionDate || ""),
    original_amount: Number(tx.original_amount ?? tx.originalAmount) || 0,
    discount_amount: Number(tx.discount_amount ?? tx.discountAmount) || 0,
    subsidy_amount: Number(tx.subsidy_amount ?? tx.subsidyAmount) || 0,
    customer_paid: Number(tx.customer_paid ?? tx.customerPaid) || 0,
    payment_status: String(tx.payment_status || tx.paymentStatus || "pending") as PaymentTransaction["payment_status"],
    receipt_url: extractUrl(tx.receipt_url) || extractUrl(tx.receiptUrl),
    invoice_url: extractUrl(tx.invoice_url) || extractUrl(tx.invoiceUrl),
    invoice_pdf_url: extractUrl(tx.invoice_pdf_url) || extractUrl(tx.invoicePdfUrl),
  });

  // Handle array response (list of transactions)
  if (Array.isArray(payload)) {
    const normalized = payload.map((tx) => normalizeTransaction(tx as Record<string, unknown>));
    return {
      data: normalized,
      total: payload.length,
      limit: sanitizedLimit,
      offset: sanitizedOffset,
    };
  }

  // Handle object response with data array
  if (payload && typeof payload === "object") {
    const transactions = payload.data || payload.transactions || [];
    const normalized = Array.isArray(transactions)
      ? transactions.map((tx: unknown) => normalizeTransaction(tx as Record<string, unknown>))
      : [];
    return {
      data: normalized,
      total: payload.total ?? normalized.length ?? 0,
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
