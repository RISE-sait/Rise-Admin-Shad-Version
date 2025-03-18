import {
    MembershipRequestDto,
    MembershipResponse,
} from '@/app/api/Api';
import { addAuthHeader } from '@/lib/auth-header';
import getValue from '@/configs/constants';
import { Membership } from '@/types/membership';

export async function getAllMemberships(): Promise<Membership[]> {
  try {

    const response = await fetch(`${getValue("API")}memberships`, {
      method: 'GET',
      ...addAuthHeader()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch memberships: ${response.statusText}`);
    }

    const membershipsResponse: MembershipResponse[] = await response.json();

    const memberships: Membership[] = membershipsResponse.map((membership) => ({
        created_at: new Date(membership.created_at!), // Convert string to Date
        id: membership.id!,
        name: membership.name!,
        updated_at: new Date(membership.updated_at!), // Convert string to Date
        description: membership.description!,
    }))

    return memberships
  } catch (error) {
    console.error('Error fetching memberships:', error);
    throw error;
  }
}

export async function createMembership(membershipData: MembershipRequestDto, jwt: string): Promise<any> {
  try {

    // Create custom headers including the firebase_token header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    console.log('Using headers:', headers);

    const response = await fetch(`${getValue('API')}memberships`, {
      method: 'POST',
      headers,
      body: JSON.stringify(membershipData)
    });

    // Get the full response text for more detailed error information

    if (!response.ok) {
        const responseText = await response.json();

      let errorMessage = `Failed to create practice: ${response.statusText}`;

      try {
        // Try to parse the response as JSON if possible
        const errorData = JSON.parse(responseText);
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = `Failed to create membership: ${errorData.error.message}`;
        } else if (errorData && errorData.message) {
          errorMessage = `Failed to create membership: ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Failed to create membership: ${JSON.stringify(errorData.error)}`;
        }

        console.error('Error data:', errorData);
      } catch (e) {
        // JSON parsing failed, use the raw response text
        console.error('Raw error response:', responseText);
      }

      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Error creating membership:', error);
    throw error;
  }
}

export async function updateMembership(membershipID: string, membershipData: MembershipRequestDto, jwt: string): Promise<any> {
  try {

    // Create custom headers including the firebase_token header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue('API')}memberships/${membershipID}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(membershipData)
    });

    // Get the full response text for more detailed error information
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = `Failed to update membership: ${response.statusText}`;

      try {
        // Try to parse the response as JSON if possible
        const errorData = JSON.parse(responseText);
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = `Failed to update membership: ${errorData.error.message}`;
        } else if (errorData && errorData.message) {
          errorMessage = `Failed to update membership: ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Failed to update membership: ${JSON.stringify(errorData.error)}`;
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
    console.error('Error creating membership:', error);
    throw error;
  }
}


export async function deleteMembership(membershipID: string, jwt: string): Promise<any> {
  try {


    // Create custom headers including the firebase_token header
    const headers = {
      'Authorization': `Bearer ${jwt}`,
    };

    await fetch(`${getValue('API')}memberships/${membershipID}`, {
      method: 'DELETE',
      headers
    });

    
  } catch (error) {
    console.error('Error creating membership:', error);
    throw error;
  }
}
