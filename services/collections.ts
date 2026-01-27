import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  CustomerBalance,
  PaymentMethodsResponse,
  SendPaymentLinkRequest,
  SendPaymentLinkResponse,
  ChargeCardRequest,
  ChargeCardResponse,
  RecordManualPaymentRequest,
  RecordManualPaymentResponse,
  CollectionHistoryResponse,
  CollectionHistoryParams,
} from "@/types/collections";

const API_BASE = getValue("API");

/**
 * Get customer balance - check if customer owes money and has payment methods
 */
export async function getCustomerBalance(
  customerId: string,
  jwt: string
): Promise<CustomerBalance> {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  if (!jwt) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(
    `${API_BASE}admin/collections/customers/${customerId}/balance`,
    {
      method: "GET",
      ...addAuthHeader(jwt),
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      // No balance info means no past due amount
      return {
        customer_id: customerId,
        past_due_amount: 0,
        open_invoices: [],
        has_payment_method: false,
      };
    }

    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch customer balance: ${response.status}`);
  }

  return response.json();
}

/**
 * Get customer's saved payment methods
 */
export async function getCustomerPaymentMethods(
  customerId: string,
  jwt: string
): Promise<PaymentMethodsResponse> {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  if (!jwt) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(
    `${API_BASE}admin/collections/customers/${customerId}/payment-methods`,
    {
      method: "GET",
      ...addAuthHeader(jwt),
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { payment_methods: [] };
    }

    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch payment methods: ${response.status}`);
  }

  return response.json();
}

/**
 * Send payment link to customer via email
 */
export async function sendPaymentLink(
  request: SendPaymentLinkRequest,
  jwt: string
): Promise<SendPaymentLinkResponse> {
  if (!jwt) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(`${API_BASE}admin/collections/send-payment-link`, {
    method: "POST",
    ...addAuthHeader(jwt),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to send payment link: ${response.status}`);
  }

  return response.json();
}

/**
 * Charge customer's card on file
 */
export async function chargeCard(
  request: ChargeCardRequest,
  jwt: string
): Promise<ChargeCardResponse> {
  if (!jwt) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(`${API_BASE}admin/collections/charge-card`, {
    method: "POST",
    ...addAuthHeader(jwt),
    body: JSON.stringify(request),
  });

  const data = await response.json();

  // The API returns success: false for failed charges, not HTTP errors
  if (!response.ok && !data.success) {
    throw new Error(data.error || data.error_message || `Failed to charge card: ${response.status}`);
  }

  return data;
}

/**
 * Record a manual payment (cash, check, e-transfer)
 */
export async function recordManualPayment(
  request: RecordManualPaymentRequest,
  jwt: string
): Promise<RecordManualPaymentResponse> {
  if (!jwt) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(`${API_BASE}admin/collections/record-manual`, {
    method: "POST",
    ...addAuthHeader(jwt),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to record payment: ${response.status}`);
  }

  return response.json();
}

/**
 * Get collection history with optional filters
 */
export async function getCollectionHistory(
  params: CollectionHistoryParams,
  jwt: string
): Promise<CollectionHistoryResponse> {
  if (!jwt) {
    throw new Error("Authentication token is required");
  }

  const url = new URL(`${API_BASE}admin/collections/attempts`);

  if (params.customer_id) url.searchParams.set("customer_id", params.customer_id);
  if (params.status) url.searchParams.set("status", params.status);
  if (params.method) url.searchParams.set("method", params.method);
  if (params.start_date) url.searchParams.set("start_date", params.start_date);
  if (params.end_date) url.searchParams.set("end_date", params.end_date);
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.offset) url.searchParams.set("offset", String(params.offset));

  const response = await fetch(url.toString(), {
    method: "GET",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { attempts: [], total: 0, limit: params.limit || 50, offset: params.offset || 0 };
    }

    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch collection history: ${response.status}`);
  }

  return response.json();
}
