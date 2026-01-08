export type DiscountType = "percentage" | "fixed_amount";
export type DurationType = "once" | "repeating" | "forever";
export type AppliesTo = "subscription" | "one_time" | "both";

export interface Discount {
  id: string;
  name: string;
  description?: string;
  discount_percent?: number;
  discount_amount?: number;
  discount_type: DiscountType;
  is_use_unlimited: boolean;
  use_per_client: number;
  is_active: boolean;
  valid_from: string;
  valid_to?: string;
  duration_type: DurationType;
  duration_months?: number;
  applies_to: AppliesTo;
  max_redemptions?: number;
  times_redeemed: number;
  stripe_coupon_id?: string;
  stripe_promotion_code_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDiscountRequest {
  name: string;
  description?: string;
  discount_percent?: number;
  discount_amount?: number;
  discount_type: DiscountType;
  is_use_unlimited: boolean;
  use_per_client?: number;
  is_active: boolean;
  valid_from: string;
  valid_to?: string;
  duration_type: DurationType;
  duration_months?: number;
  applies_to: AppliesTo;
  max_redemptions?: number;
}

export interface UpdateDiscountRequest extends CreateDiscountRequest {}
