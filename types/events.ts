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
  customers: EventParticipant[];
}

export interface EventParticipant extends Person {
  has_cancelled_enrollment: boolean;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  email?: string
  phone?: string
  gender?: string
}

export interface EventSchedule {
  id: string
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