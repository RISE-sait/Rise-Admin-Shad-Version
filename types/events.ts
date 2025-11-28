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
