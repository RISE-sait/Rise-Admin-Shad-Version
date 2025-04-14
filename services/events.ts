import getValue from '@/configs/constants';
import { addAuthHeader } from '@/lib/auth-header';
import { CalendarEvent } from '@/types/calendar';
import { EventCreateRequestDto, EventScheduleResponseDto } from '@/app/api/Api';
import { EventSchedule } from '@/types/events';

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
 * Create new events
 */
export async function createEvents(eventsData: EventCreateRequestDto, jwt: string): Promise<string | null> {
  try {
    const response = await fetch(`${getValue('API')}events`, {
      method: 'POST',
      ...addAuthHeader(jwt),
      body: JSON.stringify(eventsData),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to create events: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error creating events:', error);
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

export async function getSchedulesOfProgram(programID: string): Promise<EventSchedule[]> {

  try {

    const response = await fetch(`${getValue('API')}schedules?program_id=${programID}`)

    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get schedules of program: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return (responseJSON as EventScheduleResponseDto[]).map((schedule) => {

      const sch: EventSchedule = {
        day: schedule.day!,
        recurrence_start_at: new Date(schedule.recurrence_start_at!),
        recurrence_end_at: new Date(schedule.recurrence_end_at!),
        event_start_at: schedule.session_start_at!,
        event_end_at: schedule.session_end_at!,
        location: {
          id: schedule.location?.id!,
          name: schedule.location?.name!,
          address: schedule.location?.address!,
        }
      }

      if (schedule.program) {
        sch.program = {
          id: schedule.program.id!,
          name: schedule.program.name!,
          type: schedule.program.type!,
        }
      }

      if (schedule.team) {
        sch.team = {
          id: schedule.team.id!,
          name: schedule.team.name!,
        }
      }

      return sch
    })
  } catch (error) {
    console.error('Error getting schedules of program:', error);
    throw error;
  }

}