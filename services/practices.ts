import {
    DtoPracticeRequestDto,
    DtoPracticeResponse,
  LocationRequestDto,
  LocationResponseDto
} from '@/app/api/Api';
import { addAuthHeader } from '@/lib/auth-header';
import getValue from '@/configs/constants';
import { Practice } from '@/types/practice';

export async function getAllPractices(): Promise<Practice[]> {
  try {

    const response = await fetch(`${getValue("API")}practices`, {
      method: 'GET',
      ...addAuthHeader()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch practices: ${response.statusText}`);
    }

    const practicesResponse: DtoPracticeResponse[] = await response.json();

    const practices: Practice[] = practicesResponse.map((practice) => ({
        createdAt: new Date(practice.createdAt!), // Convert string to Date
        id: practice.id!,
        name: practice.name!,
        updatedAt: new Date(practice.updatedAt!), // Convert string to Date
        description: practice.description!
    }))

    return practices
  } catch (error) {
    console.error('Error fetching practices:', error);
    throw error;
  }
}

export async function createPractice(practiceData: DtoPracticeRequestDto, jwt: string): Promise<any> {
  try {

    // Create custom headers including the firebase_token header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    console.log('Using headers:', headers);

    const response = await fetch(`${getValue('API')}practices`, {
      method: 'POST',
      headers,
      body: JSON.stringify(practiceData)
    });

    // Get the full response text for more detailed error information
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = `Failed to create practice: ${response.statusText}`;

      try {
        // Try to parse the response as JSON if possible
        const errorData = JSON.parse(responseText);
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = `Failed to create practice: ${errorData.error.message}`;
        } else if (errorData && errorData.message) {
          errorMessage = `Failed to create practice: ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Failed to create practice: ${JSON.stringify(errorData.error)}`;
        }

        console.error('Error data:', errorData);
      } catch (e) {
        // JSON parsing failed, use the raw response text
        console.error('Raw error response:', responseText);
      }

      throw new Error(errorMessage);
    }

    // If we got a valid JSON response, parse it and return
    try {
      return JSON.parse(responseText);
    } catch {
      // If parsing fails, just return the text
      return responseText;
    }
  } catch (error) {
    console.error('Error creating practice:', error);
    throw error;
  }
}

export async function updatePractice(practiceID: string, practiceData: DtoPracticeRequestDto, jwt: string): Promise<any> {
  try {

    // Create custom headers including the firebase_token header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue('API')}practices/${practiceID}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(practiceData)
    });

    // Get the full response text for more detailed error information
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = `Failed to update practice: ${response.statusText}`;

      try {
        // Try to parse the response as JSON if possible
        const errorData = JSON.parse(responseText);
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = `Failed to update practice: ${errorData.error.message}`;
        } else if (errorData && errorData.message) {
          errorMessage = `Failed to update practice: ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Failed to update practice: ${JSON.stringify(errorData.error)}`;
        }

        console.error('Error data:', errorData);
      } catch (e) {
        // JSON parsing failed, use the raw response text
        console.error('Raw error response:', responseText);
      }

      throw new Error(errorMessage);
    }

    // If we got a valid JSON response, parse it and return
    try {
      return JSON.parse(responseText);
    } catch {
      // If parsing fails, just return the text
      return responseText;
    }
  } catch (error) {
    console.error('Error creating practice:', error);
    throw error;
  }
}


export async function deletePractice(practiceID: string, jwt: string): Promise<any> {
  try {


    // Create custom headers including the firebase_token header
    const headers = {
      'Authorization': `Bearer ${jwt}`,
    };

    await fetch(`${getValue('API')}practices/${practiceID}`, {
      method: 'DELETE',
      headers
    });

    
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
}
