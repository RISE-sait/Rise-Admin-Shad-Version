export type SubscriptionStatus = "active" | "inactive" | "canceled" | "expired" | "past_due" | "paused";

export interface CustomerMembership {
  membership_name: string;
  membership_plan_id: string;
  membership_plan_name: string;
  membership_renewal_date: string;
  membership_start_date: Date | null;
  subscription_status?: SubscriptionStatus;
  stripe_subscription_id?: string;
}

export interface Customer {
  id: string; // customer_id
  first_name: string; // name (e.g., Alice Johnson)
  last_name: string;
  email: string; // email (e.g., alice@example.com)
  phone: string;

  profilePicture: string;
  // Single membership fields (kept for backward compatibility)
  membership_name: string;
  membership_start_date: Date | null;
  membership_plan_id: string;
  membership_plan_name: string;
  membership_renewal_date: string;
  // Multiple memberships support
  memberships: CustomerMembership[];
  updated_at: Date;
  create_at: Date;
  hubspot_id?: string;
  is_archived?: boolean;

  assists: number;
  losses: number;
  points: number;
  rebounds: number;
  steals: number;
  wins: number;
  credits?: number;
  notes?: string | null;

  // Emergency contact info
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relationship?: string | null;

  // Account deletion status
  deleted_at?: string | null;
  scheduled_deletion_at?: string | null;
  archived_at?: string | null;
  days_until_deletion?: number | null;

  // Mobile app usage
  last_mobile_login_at?: string | null;

  // Pending email change
  pending_email?: string | null;

  // Parent-child linkage
  parent_id?: string | null;
}

export interface FamilyChild {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  linked_at: string;
}

export interface PendingLinkRequest {
  id: string;
  child_id: string;
  child_name: string;
  child_email: string;
  new_parent_id: string;
  new_parent_name: string;
  new_parent_email: string;
  old_parent_id: string;
  old_parent_name: string;
  old_parent_email: string;
  old_parent_verified: boolean;
  requires_old_parent: boolean;
  counterparty_verified: boolean;
  awaiting_user_action: boolean;
  initiated_by: string;
  user_role: string;
  created_at: string;
  expires_at: string;
}

export interface CustomerCreditTransaction {
  id: string;
  created_at: string;
  amount: number;
  balanceAfter?: number | null;
  description?: string | null;
  type?: string | null;
}

export interface WaiverUpload {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  notes?: string;
  uploaded_by?: string;
  uploaded_at: string | { Time: string; Valid: boolean };
}
