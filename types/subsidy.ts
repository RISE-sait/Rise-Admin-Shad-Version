// Subsidy status enum values from swagger
export type SubsidyStatus =
  | "pending"
  | "approved"
  | "active"
  | "depleted"
  | "expired"
  | "revoked";

// Summary objects returned by API
export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
}

export interface ProviderSummary {
  id: string;
  name: string;
}

// Main subsidy interface
export interface Subsidy {
  id: string;
  customer?: CustomerSummary;
  provider?: ProviderSummary;
  approved_amount: number;
  total_amount_used: number;
  remaining_balance: number;
  reason: string;
  valid_from: string;
  valid_until?: string | null;
  admin_notes?: string | null;
  status: SubsidyStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Subsidy provider interface
export interface SubsidyProvider {
  id: string;
  name: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Request DTOs for creating subsidies
export interface CreateSubsidyRequest {
  customer_id: string;
  provider_id: string;
  approved_amount: number;
  reason: string;
  valid_until?: string | null;
  admin_notes?: string | null;
}

// Request DTOs for deactivating subsidies
export interface DeactivateSubsidyRequest {
  reason: string;
}

// Request DTOs for creating providers
export interface CreateProviderRequest {
  name: string;
  contact_email?: string;
  contact_phone?: string;
}

// Subsidy usage/transaction interface
export interface SubsidyUsage {
  id: string;
  subsidy_id: string;
  amount: number;
  description?: string | null;
  created_at: string;
  payment_transaction_id?: string | null;
}

// Customer subsidy balance response
export interface SubsidyBalance {
  total_balance: number;
  subsidies: Array<{
    id: string;
    provider_name: string;
    remaining_balance: number;
    status: SubsidyStatus;
  }>;
}

// Paginated response type
export interface PaginatedSubsidiesResponse {
  data: Subsidy[];
  page: number;
  limit: number;
  total: number;
}
