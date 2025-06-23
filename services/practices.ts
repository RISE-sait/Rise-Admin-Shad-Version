import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  EventEventResponseDto,
  EventEventRequestDto,
  EventDeleteRequestDto,
  EventRecurrenceRequestDto,
} from "@/app/api/Api";
import { Practice } from "@/types/practice";
import { getEvents } from "./events";

// API helpers for fetching and mutating practice events

// Retrieve all practice events between very wide date ranges
export async function getAllPractices(): Promise<Practice[]> {
  const after = "1970-01-01";
  const before = "2100-01-01";
  const events = (await getEvents({
    after,
    before,
    program_type: "practice",
    response_type: "date",
  })) as EventEventResponseDto[];

  return events.map((e) => ({
    id: e.id!,
    program_id: e.program?.id,
    program_name: e.program?.name || "",
    location_id: e.location?.id,
    location_name: e.location?.name || "",
    team_id: e.team?.id,
    team_name: e.team?.name,
    start_at: e.start_at!,
    end_at: e.end_at!,
    capacity: e.capacity || 0,
  }));
}

// Create a single practice instance
export async function createPractice(
  practiceData: EventEventRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}events/one-time`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(practiceData),
    });

    if (!response.ok) {
      const resJson = await response.json();
      let errorMessage = `Failed to create practice: ${response.statusText}`;
      if (resJson.error) {
        errorMessage = resJson.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error creating practice:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

// Create a recurring series of practices
export async function createRecurringPractice(
  practiceData: EventRecurrenceRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}events/recurring`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(practiceData),
    });

    if (!response.ok) {
      const resJson = await response.json();
      let errorMessage = `Failed to create practice: ${response.statusText}`;
      if (resJson.error) {
        errorMessage = resJson.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error creating practice:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

// Update a previously created practice
export async function updatePractice(
  id: string,
  practiceData: EventEventRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}events/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(practiceData),
    });

    if (!response.ok) {
      const resJson = await response.json();
      let errorMessage = `Failed to update practice: ${response.statusText}`;
      if (resJson.error) {
        errorMessage = resJson.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error updating practice:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

// Delete a practice by id
export async function deletePractice(
  id: string,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}events`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
      body: JSON.stringify({ ids: [id] } as EventDeleteRequestDto),
    });

    if (!response.ok) {
      const resJson = await response.json();
      let errorMessage = `Failed to delete practice: ${response.statusText}`;
      if (resJson.error) {
        errorMessage = resJson.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error deleting practice:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}
