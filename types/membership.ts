export interface Membership {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
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
