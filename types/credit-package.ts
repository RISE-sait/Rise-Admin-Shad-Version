export interface CreditPackageResponse {
  id: string;
  name: string;
  description?: string | null;
  credit_allocation: number;
  weekly_credit_limit: number;
  stripe_price_id: string;
  price?: number;
  currency?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  description?: string;
  credit_allocation: number;
  weekly_credit_limit: number;
  stripe_price_id: string;
  price?: number;
  currency?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreditPackageRequest {
  name: string;
  description?: string;
  credit_allocation: number;
  weekly_credit_limit: number;
  stripe_price_id?: string;
  unit_amount?: number;
  currency?: string;
}
