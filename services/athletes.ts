import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";

//testing commit
export async function addAthleteToTeam(
  athleteId: string,
  teamId: string,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${getValue("API")}athletes/${athleteId}/team/${teamId}`,
      {
        method: "PUT",
        ...addAuthHeader(jwt),
      }
    );

    const text = await response.text();
    let responseJSON: any = {};
    if (text) {
      try {
        responseJSON = JSON.parse(text);
      } catch {}
    }

    if (!response.ok) {
      let errorMessage = `Failed to add athlete to team: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error(
      `Error adding athlete ${athleteId} to team ${teamId}:`,
      error
    );
    throw error;
  }
}

export async function removeAthleteFromTeam(
  athleteId: string,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${getValue("API")}athletes/${athleteId}/team`,
      {
        method: "DELETE",
        ...addAuthHeader(jwt),
      }
    );

    const text = await response.text();
    let responseJSON: any = {};
    if (text) {
      try {
        responseJSON = JSON.parse(text);
      } catch {}
    }

    if (!response.ok) {
      let errorMessage = `Failed to remove athlete from team: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error(`Error removing athlete ${athleteId} from team:`, error);
    throw error;
  }
}
