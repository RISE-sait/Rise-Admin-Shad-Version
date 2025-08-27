export interface Practice {
  id: string;
  program_id?: string;
  program_name: string;
  court_id?: string;
  court_name?: string;
  location_id?: string;
  location_name: string;
  team_id?: string;
  team_name?: string;
  booked_by?: string;
  booked_by_name?: string;
  start_at: string;
  end_at: string;
  capacity: number;
  status?: string;
}

export interface PracticeRequestDto {
  court_id: string;
  location_id: string;
  team_id: string;
  start_time: string;
  end_time?: string;
  status?: "scheduled" | "completed" | "canceled";
  booked_by?: string;
}

export interface PracticeRecurrenceRequestDto {
  court_id: string;
  location_id: string;
  team_id: string;
  day?: string;
  practice_start_at: string;
  practice_end_at: string;
  recurrence_start_at: string;
  recurrence_end_at: string;
  status?: "scheduled" | "completed" | "canceled";
}
