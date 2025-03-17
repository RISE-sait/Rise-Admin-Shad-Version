export interface Customer {
  customer_id: string; // customer_id
  first_name: string; // name (e.g., Alice Johnson)
  last_name: string;
  email: string; // email (e.g., alice@example.com)
  phone: string;
  
  profilePicture: string;
  accountType?: string;
  membership?: any;
  attendance?: any[];
  membership_renewal_date?: string | null;
  updated_at?: string | Date;
  updatedAt?: string | Date;
  hubspot_id?: string;
  
  
}
