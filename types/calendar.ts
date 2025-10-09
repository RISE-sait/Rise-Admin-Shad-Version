export type CalendarProps = {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday?: boolean;
  onEventSelect?: (event: CalendarEvent) => void; // Added this line
};

export type CalendarContextType = CalendarProps & {
  newEventDialogOpen: boolean;
  setNewEventDialogOpen: (open: boolean) => void;
  manageEventDialogOpen: boolean;
  setManageEventDialogOpen: (open: boolean) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  onEventSelect?: (event: CalendarEvent) => void; // Added this line
};
// types/calendar.ts
export interface CalendarEvent {
  id: string;
  start_at: Date;
  end_at: Date;
  capacity: number;
  color?: string;
  credit_cost?: number;
  price_id?: string;
  required_membership_plan_id?: string;
  createdBy: {
    firstName: string;
    id: string;
    lastName: string;
  };
  customers: Array<{
    email: string;
    firstName: string;
    gender: string;
    hasCancelledEnrollment: boolean;
    id: string;
    lastName: string;
    phone: string;
  }>;
  location: {
    address: string;
    id: string;
    name: string;
  };
  court?: {
    id: string;
    name: string;
  };
  program: {
    id: string;
    name: string;
    type: string;
  };
  staff: Array<{
    email: string;
    firstName: string;
    gender: string;
    id: string;
    lastName: string;
    phone: string;
    roleName: string;
  }>;
  team: {
    id: string;
    name: string;
  };
  updatedBy: {
    firstName: string;
    id: string;
    lastName: string;
  };
}

export const calendarModes = ["day", "week", "month"] as const;
export type Mode = (typeof calendarModes)[number];

// If you have existing Trainer/Class/Facility types, keep them:
export interface Trainer {
  coach_stats: {
    losses: number;
    wins: number;
  };
  country_code: string;
  created_at: string;
  email: string;
  first_name: string;
  hubspot_id: string;
  id: string;
  is_active: boolean;
  last_name: string;
  phone: string;
  role_name: string;
  updated_at: string;
}

// Updated FiltersType interface with array support for multiple selections
export interface FiltersType {
  // Date filters
  after: string; // YYYY-MM-DD
  before: string; // YYYY-MM-DD

  // Backend API filter params - single selections (legacy)
  program_id?: string;
  user_id?: string;
  team_id?: string;
  location_id?: string;
  program_type?: string;
  created_by?: string;
  updated_by?: string;

  // New multi-select options
  location_ids?: string[]; // Multiple locations
  user_ids?: string[]; // Multiple trainers/users
  program_ids?: string[]; // Multiple programs
}
