// app/(dashboard)/(home)/calender/page.tsx
import CalendarPage from '@/components/calendar/CalendarPage';
import { getAllEvents } from '@/services/events';
import { CalendarEvent } from '@/types/calendar';
import { colorOptions } from '@/components/calendar/components/calendar/calendar-tailwind-classes';

function mapToCalendarEvents(events: any[] | undefined): CalendarEvent[] {
  if (!Array.isArray(events)) {
    console.error('Events is not an array:', events);
    return [];
  }

  return (events ?? []).map(event => ({
    id: event.id,
    color: getEventColor(event.program?.type),
    start_at: new Date(event.start_at),
    end_at: new Date(event.end_at),
    capacity: event.capacity,
    createdBy: {
      firstName: event.created_by.first_name,
      id: event.created_by.id,
      lastName: event.created_by.last_name,
    },
    customers: event.customers?.map((customer: any) => ({
      email: customer.email,
      firstName: customer.first_name,
      gender: customer.gender,
      hasCancelledEnrollment: customer.has_cancelled_enrollment,
      id: customer.id,
      lastName: customer.last_name,
      phone: customer.phone,
    })),
    location: {
      address: event.location.address,
      id: event.location.id,
      name: event.location.name,
    },
    program: {
      id: event.program.id,
      name: event.program.name,
      type: event.program.type,
    },
    staff: event.staff?.map((staff: any) => ({
      email: staff.email,
      firstName: staff.first_name,
      gender: staff.gender,
      id: staff.id,
      lastName: staff.last_name,
      phone: staff.phone,
      roleName: staff.role_name,
    })),
    team: {
      id: event.team?.id ?? "",
      name: event.team?.name ?? "",
    },
    updatedBy: {
      firstName: event.updated_by?.first_name ?? "",
      id: event.updated_by?.id ?? "",
      lastName: event.updated_by?.last_name ?? "",
    },
  })) || [];
}

function getEventColor(programType?: string): string {
  switch (programType) {
    case 'practice':
      return colorOptions[1].value; // Assuming colorOptions is an array of color objects;
    case 'game':
      return colorOptions[0].value;
    case 'course':
      return colorOptions[2].value;
    default:
      return 'gray';
  }
}

export default async function Calendar() {
  let initialEvents: CalendarEvent[] = [];

  try {
    const events = await getAllEvents({
      after: '2024-01-01',
      before: '2026-02-01',
    });
    console.log('Events from getAllEvents:', events);
    initialEvents = mapToCalendarEvents(events);
  } catch (error) {
    console.error('Error fetching events in Calendar:', error);
    initialEvents = [];
  }

  return <CalendarPage initialEvents={initialEvents} />;
}