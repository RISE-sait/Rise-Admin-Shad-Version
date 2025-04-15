import {
    HaircutBarberServiceResponseDto,
    HaircutCreateBarberServiceRequestDto,
  } from '@/app/api/Api';
  import { addAuthHeader } from '@/lib/auth-header';
  import getValue from '@/configs/constants';
  
  // Get all barber services
  export async function getBarberServices(): Promise<HaircutBarberServiceResponseDto[]> {
    try {
      const response = await fetch(`${getValue('API')}barbers/services`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch barber services: ${response.statusText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching barber services:', error);
      throw error;
    }
  }

  // Add this new function:

// Get all haircut service types
export async function getHaircutServices(): Promise<any[]> {
    try {
      const response = await fetch(`${getValue('API')}haircuts/services`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch haircut services: ${response.statusText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching haircut services:', error);
      throw error;
    }
  }
  
  export async function createBarberService(
    request: HaircutCreateBarberServiceRequestDto, 
    jwt: string
  ): Promise<void> {
    try {
      const response = await fetch(`${getValue('API')}barbers/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(request)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create barber service error:', errorText);
        throw new Error(`Failed to create barber service: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating barber service:', error);
      throw error;
    }
  }
  
  // Delete a barber service
  export async function deleteBarberService(id: string, jwt: string): Promise<void> {
    try {
      const response = await fetch(`${getValue('API')}barbers/services/${id}`, {
        method: 'DELETE',
        ...addAuthHeader(jwt)
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete barber service: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting barber service ${id}:`, error);
      throw error;
    }
  }