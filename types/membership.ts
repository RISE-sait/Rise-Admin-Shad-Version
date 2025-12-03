export interface Membership {
  id: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface MembershipPlan {
  id: string;
  membership_id: string;
  name: string;
  stripe_price_id: string;
  stripe_joining_fees_id?: string;
  amt_periods: number;
  credit_allocation?: number | null;
  weekly_credit_limit?: number | null;
  visibility: boolean;
  unit_amount?: number | null;
  currency?: string | null;
  billing_interval?: string | null;
}

export interface MembershipPlanRequestDto {
  membership_id: string;
  name: string;
  stripe_price_id: string;
  stripe_joining_fees_id?: string;
  amt_periods: number;
  credit_allocation?: number;
  weekly_credit_limit?: number;
}
