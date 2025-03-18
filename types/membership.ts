export interface Membership {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface MembershipPlan {
  id: string;
  membership_id: string;
  name: string;
  price: number;
  payment_frequency?: PaymentFrequency
}

interface PaymentFrequency {
  payment_frequency: string
  amt_periods: number
}
