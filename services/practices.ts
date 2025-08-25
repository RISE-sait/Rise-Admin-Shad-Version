import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  PracticeRequestDto,
  PracticeRecurrenceRequestDto,
  Practice,
} from "@/types/practice";

// API helpers for fetching and mutating practice events

// Retrieve all practice events between very wide date ranges
export async function getAllPractices(): Promise<Practice[]> {
  const token = localStorage.getItem("jwt");
  const response = await fetch(`${getValue("API")}practices`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const resJson = await response.json();

  if (!response.ok) {
    let errorMessage = `Failed to fetch practices: ${response.statusText}`;
    if (resJson.error) {
      errorMessage = resJson.error.message;
    }
    throw new Error(errorMessage);
  }

  return (resJson as any[]).map((p) => ({
    id: p.id,
    program_id: undefined,
    program_name: "",
    court_id: p.court_id,
    court_name: p.court_name ?? "",
    location_id: p.location_id,
    location_name: p.location_name ?? "",
    team_id: p.team_id,
    team_name: p.team_name,
    booked_by_name: p.created_by
      ? `${p.created_by.first_name} ${p.created_by.last_name}`
      : (p.booked_by_name ?? ""),
    start_at: p.start_time,
    end_at: p.end_time,
    capacity: 0,
    status: p.status,
  }));
}

// Create a single practice instance
export async function createPractice(
  practiceData: PracticeRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}practices`, {
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
  practiceData: PracticeRecurrenceRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}practices/recurring`, {
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
  practiceData: PracticeRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}practices/${id}`, {
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
    const response = await fetch(`${getValue("API")}practices/${id}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
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
