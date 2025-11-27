export interface Customer {
  id: string; // customer_id
  first_name: string; // name (e.g., Alice Johnson)
  last_name: string;
  email: string; // email (e.g., alice@example.com)
  phone: string;

  profilePicture: string;
  membership_name: string;
  membership_start_date: Date | null;
  membership_plan_id: string;
  membership_plan_name: string;
  membership_renewal_date: string;
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
