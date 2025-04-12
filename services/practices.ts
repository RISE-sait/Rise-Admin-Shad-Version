import {
  PracticeLevelsResponse,
  PracticeRequestDto,
  PracticeResponse,
} from '@/app/api/Api';
import { addAuthHeader } from '@/lib/auth-header';
import getValue from '@/configs/constants';
import { Practice } from '@/types/practice';

/**
 * Get all programs with optional type filtering
 * @param type Optional program type filter (practice, game, course, others)
 */
export async function getAllPrograms(type?: string): Promise<any[]> {
  try {
    // Build URL with optional type parameter
    const url = type 
      ? `/api/programs?type=${encodeURIComponent(type)}`
      : '/api/programs';
    
    const response = await fetch(url, {
      method: 'GET',
      ...addAuthHeader()
    });

    if (!response.ok) {
      console.error(`Failed to fetch programs: ${response.status} ${response.statusText}`);
      return []; // Return empty array instead of throwing
    }

    const programsResponse = await response.json();
    return programsResponse;
  } catch (error) {
    console.error('Error fetching programs:', error);
    return []; // Return empty array on error
  }
}

/**
 * Create a new program
 */
export async function createProgram(programData: any, jwt: string): Promise<string | null> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch('/api/programs', {
      method: 'POST',
      headers,
      body: JSON.stringify(programData)
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to create program: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
}

/**
 * Update an existing program
 */
export async function updateProgram(programID: string, programData: any, jwt: string): Promise<string | null> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`/api/programs/${programID}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(programData)
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to update program: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error updating program:', error);
    throw error;
  }
}

/**
 * Delete a program
 */
export async function deleteProgram(programID: string, jwt: string): Promise<string | null> {
  try {
    const headers = {
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`/api/programs/${programID}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to delete program: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error deleting program:', error);
    throw error;
  }
}
