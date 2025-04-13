import { addAuthHeader } from '@/lib/auth-header';
import getValue from '@/configs/constants';
import { mockTeams } from '@/components/programs/api-fallback';

export interface Team {
  id: string;
  name: string;
  capacity?: number;
  coach_id?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllTeams(filters?: {
  program_id?: string;
  location_id?: string;
}): Promise<Team[]> {
  try {
    console.log('Fetching teams');
    let queryString = '';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.program_id) params.append('program_id', filters.program_id);
      if (filters.location_id) params.append('location_id', filters.location_id);
      queryString = params.toString() ? `?${params.toString()}` : '';
    }

    const response = await fetch(`${getValue('API')}teams${queryString}`);

    if (!response.ok) {
      console.error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
      console.warn("Using mock teams because API request failed");
      return mockTeams;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    console.warn("Using mock teams due to error");
    return mockTeams;
  }
}
/**
 * Get a single team by ID
 */
export async function getTeam(teamId: string): Promise<Team | null> {
  try {
    const response = await fetch(`${getValue("API")}teams/${teamId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch team: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    return null;
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

/**
 * Delete a team
 */
export async function deleteTeam(teamId: string, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}teams/${teamId}`, {
      method: 'DELETE',
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to delete team: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error(`Error deleting team ${teamId}:`, error);
    throw error;
  }
}