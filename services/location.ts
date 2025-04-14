import { Location } from '@/types/location';
import { addAuthHeader } from '@/lib/auth-header';
import { mockLocations } from '@/components/programs/api-fallback';
import { LocationRequestDto, LocationResponseDto } from '@/app/api/Api';
import getValue from '@/configs/constants';

export async function getAllLocations(): Promise<Location[]> {
  try {
    const response = await fetch(`${getValue('API')}locations`)

    if (!response.ok) {
      console.error(`Failed to fetch locations: ${response.status} ${response.statusText}`);
      console.warn("Using mock locations because API request failed");
      return mockLocations;
    }

    const locationsResponse: LocationResponseDto[] = await response.json();
    console.log("Locations fetched:", locationsResponse);

    const locations: Location[] = locationsResponse.map((facility) => ({
      id: facility.id!,
      name: facility.name!,
      Address: facility.address!,
    }));

    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    console.warn("Using mock locations due to error");
    return mockLocations;
  }
}

export async function createLocation(locationData: LocationRequestDto, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}locations`, {
      method: 'POST',
      ...addAuthHeader(jwt),
      body: JSON.stringify(locationData)
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to create location: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error creating location:', error);
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }
}


export async function updateLocation(id:string, locationData: LocationRequestDto, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}locations/${id}`, {
      method: 'PUT',
      ...addAuthHeader(jwt),
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

    return null;
  } catch (error) {
    console.error('Error updating location:', error);
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }
}


export async function deleteLocation(id: string, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}locations/${id}`, {
      method: 'DELETE',
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to delete location: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error deleting location:', error);
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }
}