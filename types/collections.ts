// Collections API types for past due payment collection

export interface OpenInvoice {
  invoice_id: string;
  amount: number;
  description: string;
  due_date: string;
  status: "open" | "paid" | "void" | "uncollectible";
}

export interface CustomerBalance {
  customer_id: string;
  past_due_amount: number;
  open_invoices: OpenInvoice[];
  has_payment_method: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  display_name: string;
}

export interface PaymentMethodsResponse {
  payment_methods: PaymentMethod[];
}

// Request types
export interface SendPaymentLinkRequest {
  customer_id: string;
  amount: number;
  description?: string;
  send_email?: boolean;
  email_override?: string;
}

export interface ChargeCardRequest {
  customer_id: string;
  payment_method_id: string;
  amount: number;
  notes?: string;
}

export interface RecordManualPaymentRequest {
  customer_id: string;
  amount: number;
  payment_method: "cash" | "check" | "e-transfer" | "other";
  notes?: string;
}

// Response types
export interface SendPaymentLinkResponse {
  success: boolean;
  collection_id: string;
  payment_link_url: string;
}

export interface ChargeCardResponse {
  success: boolean;
  collection_id: string;
  amount_collected?: number;
  receipt_url?: string;
  error_message?: string;
}

export interface RecordManualPaymentResponse {
  success: boolean;
  collection_id: string;
  amount_collected: number;
}

// Collection history types
export type CollectionMethod = "card_charge" | "payment_link" | "manual_entry";
export type CollectionStatus = "pending" | "success" | "failed";

export interface CollectionAttempt {
  id: string;
  customer_id: string;
  admin_id: string;
  amount_attempted: string;
  amount_collected: string;
  collection_method: CollectionMethod;
  payment_method_details: string;
  status: CollectionStatus;
  created_at: string;
  completed_at: string | null;
}

export interface CollectionHistoryResponse {
  attempts: CollectionAttempt[];
  total: number;
  limit: number;
  offset: number;
}

export interface CollectionHistoryParams {
  customer_id?: string;
  status?: CollectionStatus;
  method?: CollectionMethod;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}
