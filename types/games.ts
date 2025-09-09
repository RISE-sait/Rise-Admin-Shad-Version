export interface Game {
  id: string;
  home_team_id: string;
  home_team_name: string;
  home_team_logo_url: string;
  away_team_id: string;
  away_team_name: string;
  away_team_logo_url: string;
  home_score: number | null;
  away_score: number | null;
  start_time: string;
  end_time: string;
  location_id: string;
  location_name: string;
  court_id?: string;
  court_name?: string;
  status: string;
}
