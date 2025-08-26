import getValue from "@/configs/constants";
import { EventEventResponseDto, GameResponseDto } from "@/app/api/Api";

interface PracticeResponseDto {
  id: string;
  court_id?: string;
  court_name?: string;
  location_id: string;
  location_name?: string;
  team_id?: string;
  team_name?: string;
  booked_by?: string;
  booked_by_name?: string;
  start_time: string;
  end_time?: string;
  status?: string;
}

export interface ScheduleResponse {
  events: EventEventResponseDto[];
  games: GameResponseDto[];
  practices: PracticeResponseDto[];
}

export async function getSchedule(): Promise<ScheduleResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${getValue("API")}secure/schedule`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const resJson = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to fetch schedule: ${response.statusText}`;
      if (resJson.error) {
        errorMessage = resJson.error.message;
      }
      throw new Error(errorMessage);
    }

    return {
      events: (resJson.events ?? []) as EventEventResponseDto[],
      games: (resJson.games ?? []) as GameResponseDto[],
      practices: (resJson.practices ?? []) as PracticeResponseDto[],
    };
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  }
}
