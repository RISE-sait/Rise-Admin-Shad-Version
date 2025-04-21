import getValue from '@/configs/constants';
import { addAuthHeader } from '@/lib/auth-header';
import { EventEventRequestDto, EventDeleteRequestDto, EventEventResponseDto, EventRecurrenceResponseDto, EventRecurrenceRequestDto } from '@/app/api/Api';
import { EventSchedule } from '@/types/events';

export async function getEvents(query: {
  after: string;
  before: string;
  program_id?: string;
  user_id?: string;
  team_id?: string;
  location_id?: string;
  program_type?: string;
  created_by?: string;
  updated_by?: string;
}): Promise<EventEventResponseDto[]> {
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

    const response = await fetch(`${getValue('API')}events?${queryParams.toString()}`)

    const responseJSON = await response.json()

    if (!response.ok) {
      let errorMessage = `Failed to get events: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return responseJSON as EventEventResponseDto[];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * Create new events
 */
export async function createEvents(eventsData: EventRecurrenceRequestDto, jwt: string) {
  try {

    const requestData = {
      ...eventsData,
      ...(typeof eventsData.capacity !== 'undefined' && { 
        capacity: Number(eventsData.capacity) 
      })
    };

    const response = await fetch(`${getValue('API')}events/recurring`, {
      method: 'POST',
      ...addAuthHeader(jwt),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to create events: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
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
export async function updateEvent(eventID: string, eventData: EventEventRequestDto, jwt: string): Promise<string | null> {
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
 * Update existing events
 */
export async function updateEvents(eventData: EventEventRequestDto, jwt: string): Promise<string | null> {
  try {

    const response = await fetch(`${getValue('API')}events`, {
      method: 'PUT',
      ...addAuthHeader(jwt),
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to update events: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error('Error updating events:', error);
    throw error;
  }
}


export async function deleteEvents(eventIDs: EventDeleteRequestDto, jwt: string) {
  try {

    const response = await fetch(`${getValue('API')}events`, {
      method: 'DELETE',
      ...addAuthHeader(jwt),
      body: JSON.stringify(eventIDs),
    });

    if (!response.ok) {
      const responseJSON = await response.json();
      let errorMessage = `Failed to delete event: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }

      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

export async function getSchedulesOfProgram(programID: string): Promise<EventSchedule[]> {

  try {

    const response = await fetch(`${getValue('API')}events?program_id=${programID}&response_type=day`)

    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get schedules of program: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return (responseJSON as EventRecurrenceResponseDto[]).map((schedule) => {

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