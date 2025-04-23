import getValue from '@/configs/constants';
import { addAuthHeader } from '@/lib/auth-header';
import { EventEventRequestDto, EventEventResponseDto, EventRecurrenceResponseDto, EventRecurrenceRequestDto } from '@/app/api/Api';
import { Event, EventParticipant, EventSchedule } from '@/types/events';

export async function getEvents(query: {
  after: string;
  before: string;
  program_id?: string;
  participant_id?: string;
  team_id?: string;
  location_id?: string;
  program_type?: string;
  response_type: 'day' | 'date'
  created_by?: string;
  updated_by?: string;
}): Promise<typeof query['response_type'] extends 'date' ? EventEventResponseDto[] : EventRecurrenceResponseDto[]> {
  try {
    const queryParams = new URLSearchParams()

    queryParams.append('after', query.after);
    queryParams.append('before', query.before);
    if (query.program_id) queryParams.append('program_id', query.program_id);
    if (query.participant_id) queryParams.append('participant_id', query.participant_id);
    if (query.team_id) queryParams.append('team_id', query.team_id);
    if (query.location_id) queryParams.append('location_id', query.location_id);
    if (query.program_type) queryParams.append('program_type', query.program_type);
    if (query.created_by) queryParams.append('created_by', query.created_by);
    if (query.updated_by) queryParams.append('updated_by', query.updated_by);

    const response = await fetch(`${getValue('API')}events?${queryParams.toString()}&response_type=${query.response_type}`)

    const responseJSON = await response.json()

    if (!response.ok) {
      let errorMessage = `Failed to get events: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return responseJSON as typeof query['response_type'] extends 'date' ? EventEventResponseDto[] : EventRecurrenceResponseDto[]
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
export async function updateRecurrence(eventData: EventRecurrenceRequestDto, recurringId: string, jwt: string): Promise<string | null> {
  try {

    // convert capacity to number if it exists in the request data
    const response = await fetch(`${getValue('API')}events/recurring/${recurringId}`, {
      method: 'PUT',
      ...addAuthHeader(jwt),
      body: JSON.stringify({
        ...eventData,
        capacity: Number(eventData.capacity),
      }),
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


export async function deleteEventsByRecurrenceID(id: string, jwt: string) {
  try {

    const response = await fetch(`${getValue('API')}events/recurring/${id}`, {
      method: 'DELETE',
      ...addAuthHeader(jwt),
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
        id: schedule.id!,
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


export async function getEvent(id: string): Promise<Event> {

  try {

    const response = await fetch(`${getValue('API')}events/${id}`)

    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get event: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    const event = responseJSON as EventEventResponseDto

    const evt: Event = {
      id: event.id!,
      start_at: new Date(event.start_at!),
      end_at: new Date(event.end_at!),
      location: {
        id: event.location!.id!,
        name: event.location!.name!,
        address: event.location!.address!,
      },
      program: {
        id: event.program!.id!,
        name: event.program!.name!,
        type: event.program!.type!,
      },
      capacity: event.capacity!,
      created_by: {
        id: event.created_by!.id!,
        first_name: event.created_by!.first_name!,
        last_name: event.created_by!.last_name!,
      },
      updated_by: {
        id: event.updated_by!.id!,
        first_name: event.updated_by!.first_name!,
        last_name: event.updated_by!.last_name!,
      },
      team: event.team ? {
        id: event.team.id!,
        name: event.team.name!,
      } : undefined,

      customers: event.customers!.map(customer => ({
        id: customer.id!,
        first_name: customer.first_name!,
        last_name: customer.last_name!,
        email: customer.email,
        phone: customer.phone,
        gender: customer.gender,
        has_cancelled_enrollment: customer.has_cancelled_enrollment!,
      }) as EventParticipant)
    }

    return evt
  } catch (error) {
    console.error('Error getting schedules of program:', error);
    throw error;
  }

}