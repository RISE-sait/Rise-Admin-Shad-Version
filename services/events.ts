import getValue from '@/configs/constants';
import { addAuthHeader } from '@/lib/auth-header';
import { CalendarEvent } from '@/types/calendar';

export async function getAllEvents(query: {
  after: string;
  before: string;
  program_id?: string;
  user_id?: string;
  team_id?: string;
  location_id?: string;
  program_type?: string;
  created_by?: string;
  updated_by?: string;
}): Promise<CalendarEvent[]> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('after', query.after);
    queryParams.append('before', query.before);
    if (query.program_id) queryParams.append('program_id', query.program_id);
    if (query.user_id) queryParams.append('user_id', query.user_id);
    if (query.team_id) queryParams.append('team_id', query.team_id);
    if (query.location_id) queryParams.append('location_id', query.location_id);
    if (query.program_type) queryParams.append('program_type', query.program_type);
    if (query.created_by) queryParams.append('created_by', query.created_by);
    if (query.updated_by) queryParams.append('updated_by', query.updated_by);

    const url = `${getValue('API')}events?${queryParams.toString()}`;

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const eventsResponse = await response.json();
    console.log('Parsed events response:', eventsResponse);

    // Ensure it’s an array
    if (!Array.isArray(eventsResponse)) {
      console.error('Response is not an array:', eventsResponse);
      return [];
    }

    return eventsResponse as CalendarEvent[];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * Create a new event
 */
export async function createEvent(eventData: any, jwt: string): Promise<string | null> {
  try {
    const response = await fetch(`${getValue('API')}events`, {
      method: 'POST',
      ...addAuthHeader(jwt),
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to create event: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(eventID: string, eventData: any, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}events/${eventID}`, {
      method: 'PUT',
      ...addAuthHeader(jwt),
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to update event: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(eventID: string, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}events/${eventID}`, {
      method: 'DELETE',
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to delete event: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}