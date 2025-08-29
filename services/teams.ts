import { addAuthHeader } from "@/lib/auth-header";
import getValue from "@/configs/constants";
import { Team } from "@/types/team";
import { TeamResponse, TeamRequestDto } from "@/app/api/Api";

export async function getAllTeams(): Promise<Team[]> {
  try {
    const response = await fetch(`${getValue("API")}teams`);
    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get teams: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return (responseJSON as TeamResponse[]).map((team) => ({
      id: team.id!,
      name: team.name!,
      created_at: new Date(team.created_at!),
      updated_at: new Date(team.updated_at!),
      capacity: team.capacity!,
      coach_id: team.coach?.id!,
      coach_name: team.coach?.name || "",
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export async function getUserTeams(jwt: string): Promise<Team[]> {
  try {
    const response = await fetch(`${getValue("API")}secure/teams`, {
      ...addAuthHeader(jwt),
    });
    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get teams: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return (responseJSON as TeamResponse[]).map((team) => ({
      id: team.id!,
      name: team.name!,
      created_at: new Date(team.created_at!),
      updated_at: new Date(team.updated_at!),
      capacity: team.capacity!,
      coach_id: team.coach?.id!,
      coach_name: team.coach?.name || "",
    }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export async function getTeamById(id: string, jwt: string): Promise<Team> {
  try {
    const response = await fetch(`${getValue("API")}teams/${id}`, {
      ...addAuthHeader(jwt),
    });
    const data: TeamResponse = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get team: ${response.statusText}`;
      if ((data as any).error) {
        errorMessage = (data as any).error.message;
      }
      throw new Error(errorMessage);
    }

    return {
      id: data.id!,
      name: data.name!,
      capacity: data.capacity!,
      coach_id: data.coach?.id!,
      coach_name: data.coach?.name,
      created_at: new Date(data.created_at!),
      updated_at: new Date(data.updated_at!),
      roster: data.roster,
    };
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
}

export async function createTeam(
  teamData: TeamRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}teams`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const responseJSON = await response.json().catch(() => ({}));
      let errorMessage = `Failed to create team: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
}

export async function updateTeam(
  id: string,
  teamData: TeamRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}teams/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(teamData),
    });

    const responseJSON = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = `Failed to update team: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
}
// export async function createTeam(teamData: TeamRequestDto, jwt: string): Promise<string | null> {
//     try {
//       // Create custom headers including the authorization header
//       const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${jwt}`,
//       };

//       // Use relative URL path that works with Next.js proxy
//       const response = await fetch('/api/teams', {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(teamData)
//       });

//       if (!response.ok) {
//         const responseJSON = await response.json();
//         let errorMessage = `Failed to create team: ${response.statusText}`;

//         if (responseJSON.error) {
//           errorMessage = responseJSON.error.message;
//         }

//         return errorMessage;
//       }

//       return null;
//     } catch (error) {
//       console.error('Error creating team:', error);
//       throw error;
//     }
//   }

/**
 * Update an existing team
 */
// export async function updateTeam(teamId: string, teamData: Partial<TeamRequestDto>, jwt: string): Promise<string | null> {
//   try {
//     // Create custom headers including the authorization header
//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${jwt}`,
//     };

//     const response = await fetch(`${getValue('API')}teams/${teamId}`, {
//       method: 'PUT',
//       headers,
//       body: JSON.stringify(teamData)
//     });

//     if (!response.ok) {
//       const responseJSON = await response.json();
//       let errorMessage = `Failed to update team: ${response.statusText}`;

//       if (responseJSON.error) {
//         errorMessage = responseJSON.error.message;
//       }

//       return errorMessage;
//     }

//     return null;
//   } catch (error) {
//     console.error(`Error updating team ${teamId}:`, error);
//     throw error;
//   }
// }

export async function deleteTeam(
  teamId: string,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}teams/${teamId}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });

    const text = await response.text();
    let responseJSON: any = {};
    if (text) {
      try {
        responseJSON = JSON.parse(text);
      } catch {}
    }

    if (!response.ok) {
      let errorMessage = `Failed to delete team: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return null;
  } catch (error) {
    console.error(`Error deleting team ${teamId}:`, error);
    throw error;
  }
}
