import { addAuthHeader } from '@/lib/auth-header';
import getValue from '@/configs/constants';
import { Team } from '@/types/team';
import { TeamResponse } from '@/app/api/Api';

export async function getAllTeams(): Promise<Team[]> {
  try {
    const response = await fetch(`${getValue('API')}teams`);

    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get teams: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return (responseJSON as TeamResponse[]).map((team) => (
      {
        id: team.id!,
        name: team.name!,
        created_at: new Date(team.created_at!), // Convert string to Date
        updated_at: new Date(team.updated_at!), // Convert string to Date
        capacity: team.capacity!,
        coach_id: team.coach_id!,
      }))
  } catch (error) {
    console.error('Error fetching teams:', error);
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


export async function deleteTeam(teamId: string, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}teams/${teamId}`, {
      method: 'DELETE',
      ...addAuthHeader(jwt),
    })

    const responseJSON = await response.json();

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