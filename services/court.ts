import getValue from "@/configs/constants";
import { Court } from "@/types/court";
import { addAuthHeader } from "@/lib/auth-header";
import { CourtRequestDto } from "@/app/api/Api";

export async function getAllCourts(): Promise<Court[]> {
  try {
    const response = await fetch(`${getValue("API")}courts`);
    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get courts: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return (responseJSON as any[]).map((court) => ({
      id: court.id!,
      name: court.name!,
      location_id: court.location_id!,
      location_name: court.location_name,
    }));
  } catch (error) {
    console.error("Error fetching courts:", error);
    throw error;
  }
}

export async function createCourt(
  courtData: CourtRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}courts`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(courtData),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to create court: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error creating court:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

export async function updateCourt(
  id: string,
  courtData: CourtRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}courts/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(courtData),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to update court: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error updating court:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

export async function deleteCourt(
  id: string,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}courts/${id}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to delete court: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error deleting court:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}
