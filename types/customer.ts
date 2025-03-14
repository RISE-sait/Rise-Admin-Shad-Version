export interface Customer {
  customer_id: string; // customer_id
  name: string; // name (e.g., Alice Johnson)
  email: string; // email (e.g., alice@example.com)
  phone: string;
  accountType: string;
  profilePicture: string;
  membership: string; // membership (e.g., Elite Plan)
  attendance: number; // attendance (e.g., 0)
  membership_renewal_date: string; // membership_renewal_date (e.g., 2026-02-11T22:23:38Z)
}
