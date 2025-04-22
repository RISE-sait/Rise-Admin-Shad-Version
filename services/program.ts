import { Program } from "@/types/program";
import { addAuthHeader } from "@/lib/auth-header";
import getValue from "@/configs/constants";
import { ProgramLevelsResponse, ProgramRequestDto, ProgramResponse } from "@/app/api/Api";

export async function getAllPrograms(type?: string): Promise<Program[]> {
  try {
    const queryParams = type && type !== "all" ? `?type=${type}` : '';

    const response = await fetch(`${getValue("API")}programs${queryParams}`)

    const responseJSON = await response.json()

    if (!response.ok) {
      let errorMessage = `Failed to get programs: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    const programs: Program[] = (responseJSON as ProgramResponse[]).map((program) => ({
      id: program.id!,
      name: program.name!,
      description: program.description || "",
      level: program.level || "",
      type: program.type || "",
      capacity: program.capacity || 0,
      created_at: program.created_at || "",
      updated_at: program.updated_at || "",
    }))

    return programs
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
}

/**
 * Get all program levels
 */
export async function getAllProgramLevels(): Promise<string[]> {
  try {
    const response = await fetch(`${getValue("API")}programs/levels`)

    const responseJSON = await response.json()

    if (!response.ok) {
      let errorMessage = `Failed to get program levels: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return (responseJSON as ProgramLevelsResponse).levels!
  } catch (error) {
    console.error('Error fetching program levels:', error);
    throw error;
  }
}

/**
 * Create a new program
 */
export async function createProgram(programData: ProgramRequestDto, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue("API")}programs`, {
      method: 'POST',
      ...addAuthHeader(jwt),
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
export async function getProgramById(id: string): Promise<Program | null> {
  try {
    const response = await fetch(`${getValue("API")}programs/${id}`)

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
export async function updateProgram(id: string, programData: ProgramRequestDto, jwt: string): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}programs/${id}`, {
      method: 'PUT',
      ...addAuthHeader(jwt),
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
    const response = await fetch(`${getValue("API")}programs/${id}`, {
      method: 'DELETE',
      ...addAuthHeader(jwt),
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