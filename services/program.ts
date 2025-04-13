import {
  PracticeLevelsResponse,
  PracticeRequestDto,
  PracticeResponse,
} from '@/app/api/Api';
import { addAuthHeader } from '@/lib/auth-header';
import { Practice } from '@/types/program';
import getValue from '../configs/constants';

// Helper function to get the full URL for API requests
function getApiUrl(path: string): string {
  // Check if we're running on the server
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // On server side, use absolute URL with the appropriate host
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${baseUrl}${path}`;
  } else {
    // On client side, use relative path
    return path;
  }
}

/**
 * Get all programs with optional type filtering
 * @param type Optional program type filter (practice, game, course, others)
 */
export async function getAllPrograms(type?: string): Promise<any[]> {
  try {
    // Build URL with optional type parameter
    const path = type 
      ? `/api/programs?type=${encodeURIComponent(type)}`
      : '/api/programs';
    
    const url = getApiUrl(path);
    
    const response = await fetch(url, {
      method: 'GET',
      ...addAuthHeader(),
      // Add cache: 'no-store' for SSR requests to avoid caching
      cache: typeof window === 'undefined' ? 'no-store' : undefined
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

export async function getAllProgramLevels(): Promise<string[]> {
  try {
    // Use the new programs/levels endpoint
    const url = getApiUrl('/api/programs/levels');
    
    const response = await fetch(url, {
      cache: typeof window === 'undefined' ? 'no-store' : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch practice levels: ${response.statusText}`);
    }

    const levelsResponse = await response.json();
    return levelsResponse.levels || [];
  } catch (error) {
    console.error('Error fetching practice levels:', error);
    return [];
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
