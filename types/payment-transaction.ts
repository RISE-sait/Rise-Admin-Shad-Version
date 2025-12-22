// Payment transaction types for the Payments API

export type PaymentTransactionType =
  | "event_registration"
  | "program_enrollment"
  | "credit_package"
  | "membership_subscription"
  | "membership_renewal";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "refunded";

export interface PaymentTransaction {
  id: string;
  customer_email: string;
  customer_name: string;
  transaction_type: PaymentTransactionType;
  transaction_date: string;
  original_amount: number;
  discount_amount: number;
  subsidy_amount: number;
  customer_paid: number;
  payment_status: PaymentStatus;
  receipt_url?: string | null;
  invoice_url?: string | null;
  invoice_pdf_url?: string | null;
}

export interface PaginatedPaymentTransactionsResponse {
  data: PaymentTransaction[];
  total: number;
  limit: number;
  offset: number;
}
