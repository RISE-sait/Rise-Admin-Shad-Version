import { addAuthHeader } from "@/lib/auth-header";
import getValue from "@/configs/constants";
import { Team } from "@/types/team";
import { TeamResponse, TeamRequestDto } from "@/app/api/Api";

export async function getAllTeams(): Promise<Team[]> {
  try {
    const response = await fetch(`${getValue("API")}teams`, {
      cache: "no-store",
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
      logo_url: team.logo_url || "",
      is_external: team.is_external || false,
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
      cache: "no-store",
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
      logo_url: team.logo_url || "",
      is_external: team.is_external || false,
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
      cache: "no-store",
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
      logo_url: data.logo_url || "",
      roster: data.roster,
      is_external: data.is_external || false,
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
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

      if (responseJSON.error?.message) {
        errorMessage = responseJSON.error.message;
      } else if (responseJSON.error) {
        errorMessage = String(responseJSON.error);
      } else if (responseJSON.message) {
        errorMessage = responseJSON.message;
      } else if (text) {
        errorMessage = text;
      }

      // Check for specific constraint violations and provide helpful messages
      if (errorMessage.includes("games_home_team_id_fkey") ||
          errorMessage.includes("games_away_team_id_fkey")) {
        errorMessage = "Cannot delete: This team has associated games. Please remove the team from all games first, or contact an administrator.";
      } else if (errorMessage.includes("practices_team_id_fkey")) {
        errorMessage = "Cannot delete: This team has associated practices. Please remove the team from all practices first, or contact an administrator.";
      } else if (errorMessage.includes("foreign key constraint") || errorMessage.includes("fk_")) {
        errorMessage = "Cannot delete: This team has associated records (games, practices, etc.). Please remove all associations first, or contact an administrator.";
      } else if (errorMessage.includes("violates check constraint")) {
        errorMessage = "Cannot delete: Database constraint violation. This team has required associations. Please remove all associations first.";
      }

      throw new Error(errorMessage);
    }

    return null;
  } catch (error) {
    console.error(`Error deleting team ${teamId}:`, error);
    throw error;
  }
}

// External teams functions for coaches
export async function getAllExternalTeams(jwt: string): Promise<Team[]> {
  try {
    const response = await fetch(`${getValue("API")}teams/external`, {
      ...addAuthHeader(jwt),
      cache: "no-store",
    });
    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get external teams: ${response.statusText}`;
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
      coach_id: team.coach?.id,
      coach_name: team.coach?.name || "",
      logo_url: team.logo_url || "",
      is_external: team.is_external,
      roster: team.roster,
    }));
  } catch (error) {
    console.error("Error fetching external teams:", error);
    throw error;
  }
}

export interface ExternalTeamRequestDto {
  capacity: number;
  logo_url?: string;
  name: string;
}

export async function createExternalTeam(
  teamData: ExternalTeamRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}teams/external`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const responseJSON = await response.json().catch(() => ({}));
      let errorMessage = `Failed to create external team: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error creating external team:", error);
    throw error;
  }
}

/**
 * Get all teams where a specific staff member is the coach
 */
export async function getTeamsByCoach(coachId: string, jwt: string): Promise<Team[]> {
  try {
    const allTeams = await getAllTeams();
    return allTeams.filter(team => team.coach_id === coachId);
  } catch (error) {
    console.error("Error fetching teams by coach:", error);
    throw error;
  }
}

/**
 * Remove a coach from a team by setting coach_id to null
 */
export async function removeCoachFromTeam(teamId: string, jwt: string): Promise<string | null> {
  try {
    // First, get the current team data
    const team = await getTeamById(teamId, jwt);

    // Update the team with coach_id set to null
    const response = await fetch(`${getValue("API")}teams/${teamId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: team.name,
        capacity: team.capacity,
        coach_id: null, // Remove the coach
        logo_url: team.logo_url,
      }),
    });

    const responseJSON = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = `Failed to remove coach from team: ${response.statusText}`;
      if (responseJSON.error?.message) {
        errorMessage = responseJSON.error.message;
      } else if (responseJSON.error) {
        errorMessage = String(responseJSON.error);
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error removing coach from team:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}
