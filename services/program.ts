import { Practice, PracticeRequestDto } from "@/types/program";
import { addAuthHeader } from "@/lib/auth-header";
import  getValue  from "@/configs/constants";
import { mockPrograms, mockLevels } from "@/components/programs/api-fallback";

export async function getAllPrograms(type?: string): Promise<Practice[]> {
  try {
    const baseUrl = getValue("API");
    const queryParams = type && type !== "all" ? `?type=${type}` : '';
    const url = `${baseUrl}programs${queryParams}`;
    
    const response = await fetch(`/api/programs${queryParams}`, {
      method: 'GET',
      ...addAuthHeader(),
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch programs: ${response.status} ${response.statusText}`);
      console.warn("Using mock data because API request failed");
      return type 
        ? mockPrograms.filter(p => p.type === type) 
        : mockPrograms;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching programs:', error);
    console.warn("Using mock data due to error");
    return type 
      ? mockPrograms.filter(p => p.type === type) 
      : mockPrograms;
  }
}

/**
 * Get all program levels
 */
export async function getAllProgramLevels(): Promise<string[]> {
  try {
    console.log('Fetching program levels');
    const response = await fetch('/api/programs/levels', {
      method: 'GET',
      ...addAuthHeader(),
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch program levels: ${response.status} ${response.statusText}`);
      console.warn("Using default levels because API request failed");
      return mockLevels;
    }

    const levelsResponse = await response.json();
    return levelsResponse.levels || mockLevels;
  } catch (error) {
    console.error('Error fetching program levels:', error);
    console.warn("Using default levels due to error");
    return mockLevels;
  }
}

/**
 * Create a new program
 */
export async function createProgram(programData: PracticeRequestDto, jwt: string): Promise<string | null> {
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
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

/**
 * Get program by ID
 */
export async function getProgramById(id: string): Promise<Practice | null> {
  try {
    const response = await fetch(`/api/programs/${id}`, {
      method: 'GET',
      ...addAuthHeader()
    });

    if (!response.ok) {
      console.error(`Failed to fetch program: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching program ${id}:`, error);
    return null;
  }
}

/**
 * Update a program
 */
export async function updateProgram(id: string, programData: PracticeRequestDto, jwt: string): Promise<string | null> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`/api/programs/${id}`, {
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
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

/**
 * Delete a program
 */
export async function deleteProgram(id: string, jwt: string): Promise<string | null> {
  try {
    const headers = {
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`/api/programs/${id}`, {
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
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }
}