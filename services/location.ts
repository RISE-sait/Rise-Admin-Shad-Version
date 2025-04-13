import { FacilityLocation } from '@/types/location';
import { addAuthHeader } from '@/lib/auth-header';
import { mockLocations } from '@/components/programs/api-fallback';

export interface LocationResponseDto {
  id?: string;
  name?: string;
  address?: string;
}

export interface LocationRequestDto {
  name: string;
  address: string;
}

export async function getAllLocations(): Promise<FacilityLocation[]> {
  try {
    console.log('Fetching locations');
    const response = await fetch('/api/locations', {
      method: 'GET',
      ...addAuthHeader(),
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch locations: ${response.status} ${response.statusText}`);
      console.warn("Using mock locations because API request failed");
      return mockLocations;
    }

    const locationsResponse: LocationResponseDto[] = await response.json();
    console.log("Locations fetched:", locationsResponse);

    const locations: FacilityLocation[] = locationsResponse.map((facility) => ({
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
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch('/api/locations', {
      method: 'POST',
      headers,
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