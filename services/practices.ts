import {
  PracticeLevelsResponse,
  PracticeRequestDto,
  PracticeResponse,
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

    const practicesResponse: PracticeResponse[] = await response.json();

    const practices: Practice[] = practicesResponse.map((practice) => ({
      createdAt: new Date(practice.createdAt!), // Convert string to Date
      capacity: practice.capacity!,
      id: practice.id!,
      name: practice.name!,
      level: practice.level!,
      updatedAt: new Date(practice.updatedAt!), // Convert string to Date
      description: practice.description!
    }))

    return practices
  } catch (error) {
    console.error('Error fetching practices:', error);
    throw error;
  }
}

export async function getAllPracticeLevels(): Promise<string[]> {
  try {

    const response = await fetch(`${getValue("API")}practices/levels`, {
      method: 'GET',
      ...addAuthHeader()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch practices: ${response.statusText}`);
    }

    const practiceLevelsResponse: PracticeLevelsResponse = await response.json();

    return practiceLevelsResponse.levels ?? []
  } catch (error) {
    console.error('Error fetching practices:', error);
    throw error;
  }
}

export async function createPractice(practiceData: PracticeRequestDto, jwt: string): Promise<string | null> {
  try {

    // Create custom headers including the firebase_token header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue('API')}practices`, {
      method: 'POST',
      headers,
      body: JSON.stringify(practiceData)
    });

    if (!response.ok) {

    const responseJSON = await response.json();

      let errorMessage = `Failed to create practice: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;

    }

    return null
  } catch (error) {
    console.error('Error creating practice:', error);
    throw error;
  }
}

export async function updatePractice(practiceID: string, practiceData: PracticeRequestDto, jwt: string): Promise<string | null> {
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

    if (!response.ok) {

      const responseJSON = await response.json();

      let errorMessage = `Failed to update practice: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;

    }

    return null
  } catch (error) {
    console.error('Error creating practice:', error);
    throw error;
  }
}


export async function deletePractice(practiceID: string, jwt: string): Promise<string | null> {
  try {


    // Create custom headers including the firebase_token header
    const headers = {
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue('API')}practices/${practiceID}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {

      const responseJSON = await response.json();

      let errorMessage = `Failed to delete practice: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;

    }

    return null


  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
}
