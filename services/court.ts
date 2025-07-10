import getValue from "@/configs/constants";
import { Court } from "@/types/court";

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
    }));
  } catch (error) {
    console.error("Error fetching courts:", error);
    throw error;
  }
}
