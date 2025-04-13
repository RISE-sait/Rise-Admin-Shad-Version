export interface Membership {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MembershipPlan {
  id: string;
  membership_id: string;
  name: string;
  stripe_price_id: string;
  stripe_joining_fees_id?: string;
  amt_periods: number;
}

export interface MembershipPlanRequestDto {
  membership_id: string;
  name: string;
  stripe_price_id: string;
  stripe_joining_fees_id?: string;
  amt_periods: number;
}