import {
  LocationRequestDto,
  LocationResponseDto
} from '@/app/api/Api';
import { addAuthHeader } from '@/lib/auth-header';
import getValue from '@/configs/constants';
import { Location } from '@/types/location';

export async function getAllLocations(): Promise<Location[]> {
  try {

    const response = await fetch(`${getValue("API")}locations`, {
      method: 'GET',
    });

    const locationsResponse: LocationResponseDto[] = await response.json();

    const locations: Location[] = locationsResponse.map((facility) => ({
      id: facility.id!,
      name: facility.name!,
      Address: facility.address!,
    }))

    return locations
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}

export async function createLocation(locationData: LocationRequestDto, jwt: string): Promise<string | null> {
  try {

    // Create custom headers including the firebase_token header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue('API')}locations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(locationData)
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

export async function updateLocation(locationID: string, locationData: LocationRequestDto, jwt: string): Promise<string | null> {
  try {

    // Create custom headers including the firebase_token header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue('API')}locations/${locationID}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(locationData)
    });

    if (!response.ok) {

      const responseJSON = await response.json();

      let errorMessage = `Failed to update location: ${response.statusText}`;

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


export async function deleteLocation(locationID: string, jwt: string): Promise<string | null> {
  try {


    console.log('Using headers:', jwt);

    // Create custom headers including the firebase_token header
    const headers = {
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue('API')}locations/${locationID}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {

      const responseJSON = await response.json();

      let errorMessage = `Failed to delete location: ${response.statusText}`;

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
