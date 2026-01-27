export interface Event {
  id: string;
  program: {
    id: string;
    name: string;
    type: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
  };
  team?: {
    id: string;
    name: string;
  };
  capacity: number;
  created_by: Person;
  updated_by: Person;
  start_at: Date;
  end_at: Date;
  staff?: EventStaffMember[];
  customers: EventParticipant[];
  registration_required: boolean;
}

export interface EventParticipant extends Person {
  has_cancelled_enrollment: boolean;
}

export interface EventStaffMember extends Person {
  role_name: string;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  gender?: string;
}

export interface EventSchedule {
  id: string;
  day: string;
  location: EventLocation;
  program?: EventProgram;
  recurrence_end_at: Date;
  recurrence_start_at: Date;
  event_end_at: string;
  event_start_at: string;
  team?: EventTeam;
}

export interface EventLocation {
  id: string;
  name: string;
  address: string;
}

export interface EventProgram {
  id: string;
  name: string;
  type: string;
}

export interface EventTeam {
  id: string;
  name: string;
}

export interface EventCreateRequest {
  program_id?: string;
  team_id?: string;
  location_id?: string;
  court_id?: string | null;
  start_at: string;
  end_at: string;
  capacity?: number;
  credit_cost?: number;
  price_id?: string;
  unit_amount?: number; // Price in cents (e.g., 2500 for $25.00)
  currency?: string; // e.g., "cad" or "usd"
  required_membership_plan_ids?: string[];
  registration_required?: boolean; // When false, users cannot enroll in this event
}

export interface EventRecurrenceCreateRequest {
  program_id?: string;
  team_id?: string;
  location_id?: string;
  court_id?: string | null;
  recurrence_start_at: string;
  recurrence_end_at: string;
  event_start_at: string;
  event_end_at: string;
  day?: string;
  capacity?: number;
  credit_cost?: number;
  price_id?: string;
  unit_amount?: number; // Price in cents (e.g., 2500 for $25.00)
  currency?: string; // e.g., "cad" or "usd"
  required_membership_plan_ids?: string[];
  registration_required?: boolean; // When false, users cannot enroll in this event
}

// Event Notification Types
export type NotificationChannel = "email" | "push" | "both";

export interface EnrolledCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  has_push_token: boolean;
}

export interface EnrolledCustomersResponse {
  total_count: number;
  customers: EnrolledCustomer[];
}

export interface SendNotificationRequest {
  channel: NotificationChannel;
  subject?: string;
  message: string;
  include_event_details?: boolean;
  customer_ids?: string[] | null;
}

export interface SendNotificationResponse {
  notification_id: string;
  recipient_count: number;
  email_sent: number;
  email_failed: number;
  push_sent: number;
  push_failed: number;
}

export interface NotificationHistoryItem {
  id: string;
  event_id: string;
  sent_by: string;
  sent_by_name: string;
  channel: NotificationChannel;
  subject: string;
  message: string;
  include_event_details: boolean;
  recipient_count: number;
  email_success_count: number;
  email_failure_count: number;
  push_success_count: number;
  push_failure_count: number;
  created_at: string;
}

export interface NotificationHistoryResponse {
  notifications: NotificationHistoryItem[];
}

// Credit Refund Types for removing customers from events
export interface RemoveCustomerRequest {
  refund_credits?: boolean;
  reason?: string;
}

export interface RefundInfo {
  processed: boolean;
  credits_refunded: number;
}

export interface RemoveCustomerResponse {
  message: string;
  refund?: RefundInfo;
}
