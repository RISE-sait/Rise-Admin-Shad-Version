export interface Practice {
  id: string;
  program_id?: string;
  program_name: string;
  location_id?: string;
  location_name: string;
  team_id?: string;
  team_name?: string;
  start_at: string;
  end_at: string;
  capacity: number;
}
