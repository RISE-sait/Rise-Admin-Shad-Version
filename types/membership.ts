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
  /** Price in cents or dollars as returned by the API */
  price?: number;
  /** Joining fee amount if available */
  joining_fee?: number;
}

export interface MembershipPlanRequestDto {
  membership_id: string;
  name: string;
  stripe_price_id: string;
  stripe_joining_fees_id?: string;
  amt_periods: number;
}