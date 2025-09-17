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
}
