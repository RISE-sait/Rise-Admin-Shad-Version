import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  EventEventResponseDto,
  EventRecurrenceResponseDto,
} from "@/app/api/Api";
import {
  Event,
  EventParticipant,
  EventSchedule,
  EventCreateRequest,
  EventRecurrenceCreateRequest,
  EventStaffMember,
} from "@/types/events";

export async function getEventsByMonth(
  month: string
): Promise<EventEventResponseDto[]> {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(
      `${getValue("API")}secure/events?month=${month}&response_type=date`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get events: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return responseJSON as EventEventResponseDto[];
  } catch (error) {
    console.error("Error fetching events by month:", error);
    throw error;
  }
}

export async function getEvents(query: {
  after: string;
  before: string;
  program_id?: string;
  participant_id?: string;
  team_id?: string;
  location_id?: string;
  program_type?: string;
  response_type: "day" | "date";
  created_by?: string;
  updated_by?: string;
}): Promise<
  (typeof query)["response_type"] extends "date"
    ? EventEventResponseDto[]
    : EventRecurrenceResponseDto[]
> {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("after", query.after);
    queryParams.append("before", query.before);
    if (query.program_id) queryParams.append("program_id", query.program_id);
    if (query.participant_id)
      queryParams.append("participant_id", query.participant_id);
    if (query.team_id) queryParams.append("team_id", query.team_id);
    if (query.location_id) queryParams.append("location_id", query.location_id);
    if (query.program_type)
      queryParams.append("program_type", query.program_type);
    if (query.created_by) queryParams.append("created_by", query.created_by);
    if (query.updated_by) queryParams.append("updated_by", query.updated_by);

    const token = localStorage.getItem("jwt");
    const response = await fetch(
      `${getValue("API")}secure/events?${queryParams.toString()}&response_type=${query.response_type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseJSON = await response.json();

    if (!response.ok) {
      let errorMessage = `Failed to get events: ${response.statusText}`;
      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }

    return responseJSON as (typeof query)["response_type"] extends "date"
      ? EventEventResponseDto[]
      : EventRecurrenceResponseDto[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

/**
 * Create a one-time event
 */
export async function createEvent(
  eventData: EventCreateRequest,
  jwt: string
): Promise<string | null> {
  try {
    const { court_id, capacity, credit_cost, ...rest } = eventData;
    const requestData: Record<string, unknown> = {
      ...rest,
      ...(typeof capacity !== "undefined" && { capacity: Number(capacity) }),
      ...(typeof credit_cost !== "undefined" && {
        credit_cost: Number(credit_cost),
      }),
      court_id: court_id || null,
    };

    const response = await fetch(`${getValue("API")}events/one-time`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(requestData),
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
    console.error("Error creating event:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

/**
 * Create new events
 */
export async function createEvents(
  eventsData: EventRecurrenceCreateRequest,
  jwt: string
) {
  try {
    const { court_id, capacity, credit_cost, ...rest } = eventsData;
    const requestData: Record<string, unknown> = {
      ...rest,
      ...(typeof capacity !== "undefined" && { capacity: Number(capacity) }),
      ...(typeof credit_cost !== "undefined" && {
        credit_cost: Number(credit_cost),
      }),
      court_id: court_id || null,
    };

    const response = await fetch(`${getValue("API")}events/recurring`, {
      method: "POST",
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
    console.error("Error creating events:", error);
    throw error;
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(
  eventID: string,
  eventData: EventCreateRequest,
  jwt: string
): Promise<string | null> {
  try {
    const { court_id, capacity, credit_cost, ...rest } = eventData;
    const requestData: Record<string, unknown> = {
      ...rest,
      ...(typeof capacity !== "undefined" && { capacity: Number(capacity) }),
      ...(typeof credit_cost !== "undefined" && {
        credit_cost: Number(credit_cost),
      }),
      court_id: court_id || null,
    };

    const response = await fetch(`${getValue("API")}events/${eventID}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(requestData),
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
    console.error("Error updating event:", error);
    throw error;
  }
}

/**
 * Update existing events
 */
export async function updateRecurrence(
  eventData: EventRecurrenceCreateRequest,
  recurringId: string,
  jwt: string
): Promise<string | null> {
  try {
    // convert capacity to number if it exists in the request data
    const { court_id, ...rest } = eventData;
    const requestData: Record<string, unknown> = {
      ...rest,
      capacity: Number(eventData.capacity),
      court_id: court_id || null,
    };

    const response = await fetch(
      `${getValue("API")}events/recurring/${recurringId}`,
      {
        method: "PUT",
        ...addAuthHeader(jwt),
        body: JSON.stringify(requestData),
      }
    );

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
    console.error("Error updating events:", error);
    throw error;
  }
}

export async function deleteEventsByRecurrenceID(id: string, jwt: string) {
  try {
    const response = await fetch(`${getValue("API")}events/recurring/${id}`, {
      method: "DELETE",
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
    console.error("Error deleting event:", error);
    throw error;
  }
}

export async function deleteEvent(
  id: string,
  jwt: string
): Promise<string | null> {
  try {
    const response = await fetch(`${getValue("API")}events`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
      body: JSON.stringify({ ids: [id] }),
    });

    if (!response.ok) {
      const resJson = await response.json();
      let errorMessage = `Failed to delete event: ${response.statusText}`;
      if (resJson.error) {
        errorMessage = resJson.error.message;
      }
      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error deleting event:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

export async function assignStaffToEvent(
  eventId: string,
  staffId: string,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(
      `${getValue("API")}events/${eventId}/staffs/${staffId}`,
      {
        method: "POST",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      const responseJSON = await response.json().catch(() => ({}));
      let errorMessage = `Failed to assign staff to event: ${response.statusText}`;
      if (responseJSON.error?.message) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error assigning staff to event:", error);
    throw error;
  }
}

export async function unassignStaffFromEvent(
  eventId: string,
  staffId: string,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(
      `${getValue("API")}events/${eventId}/staffs/${staffId}`,
      {
        method: "DELETE",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      const responseJSON = await response.json().catch(() => ({}));
      let errorMessage = `Failed to remove staff from event: ${response.statusText}`;
      if (responseJSON.error?.message) {
        errorMessage = responseJSON.error.message;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error removing staff from event:", error);
    throw error;
  }
}

export async function getSchedulesOfProgram(
  programID: string
): Promise<EventSchedule[]> {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(
      `${getValue("API")}secure/events?program_id=${programID}&response_type=day`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
        },
      };

      if (schedule.program) {
        sch.program = {
          id: schedule.program.id!,
          name: schedule.program.name!,
          type: schedule.program.type!,
        };
      }

      if (schedule.team) {
        sch.team = {
          id: schedule.team.id!,
          name: schedule.team.name!,
        };
      }

      return sch;
    });
  } catch (error) {
    console.error("Error getting schedules of program:", error);
    throw error;
  }
}

export async function getEvent(id: string, jwt?: string): Promise<Event> {
  try {
    const token =
      jwt ??
      (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);

    const response = await fetch(
      `${getValue("API")}events/${id}`,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    );

    const contentType = response.headers.get("content-type") ?? "";
    const responseText = await response.text();
    const trimmedResponseText = responseText.trim();

    let responseJSON: unknown = null;
    if (contentType.includes("application/json") && responseText) {
      try {
        responseJSON = JSON.parse(responseText);
      } catch (_parseError) {
        if (response.ok) {
          throw new Error("Failed to parse event details.");
        }
      }
    }

    if (!response.ok) {
      let errorMessage = `Failed to get event: ${response.statusText}`;

      if (
        responseJSON &&
        typeof responseJSON === "object" &&
        "error" in responseJSON &&
        responseJSON.error &&
        typeof responseJSON.error === "object" &&
        responseJSON.error !== null &&
        "message" in responseJSON.error
      ) {
        const message = (responseJSON.error as { message?: string }).message;
        if (message) {
          errorMessage = message;
        }
      } else if (
        !contentType.includes("application/json") &&
        trimmedResponseText &&
        !trimmedResponseText.startsWith("<")
      ) {
        errorMessage = trimmedResponseText;
      }

      throw new Error(errorMessage);
    }

    if (!responseJSON || typeof responseJSON !== "object") {
      throw new Error("Failed to parse event response.");
    }

    const event = responseJSON as EventEventResponseDto;

    const staffMembers: EventStaffMember[] =
      event.staff?.map((staffMember) => ({
        id: staffMember.id ?? "",
        first_name: staffMember.first_name ?? "",
        last_name: staffMember.last_name ?? "",
        email: staffMember.email ?? undefined,
        phone: staffMember.phone ?? undefined,
        gender: staffMember.gender ?? undefined,
        role_name: staffMember.role_name ?? "",
      })) ?? [];

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
      team: event.team
        ? {
            id: event.team.id!,
            name: event.team.name!,
          }
        : undefined,
      staff: staffMembers,

      customers: event.customers!.map(
        (customer) =>
          ({
            id: customer.id!,
            first_name: customer.first_name!,
            last_name: customer.last_name!,
            email: customer.email,
            phone: customer.phone,
            gender: customer.gender,
            has_cancelled_enrollment: customer.has_cancelled_enrollment!,
          }) as EventParticipant
      ),
    };

    return evt;
  } catch (error) {
    console.error("Error getting schedules of program:", error);
    throw error;
  }
}
