import CalendarPage from '@/components/calendar/CalendarPage';
import { getEvents } from '@/services/events';
import { CalendarEvent } from '@/types/calendar';
import { colorOptions } from '@/components/calendar/components/calendar/calendar-tailwind-classes';
import RoleProtected from '@/components/RoleProtected'
import { EventEventResponseDto } from '@/app/api/Api';

function mapToCalendarEvents(events: EventEventResponseDto[]): CalendarEvent[] {
  if (!Array.isArray(events)) {
    console.error('Events is not an array:', events);
    return [];
  }

  return events.map(event => ({
    id: event.id!,
    color: getEventColor(event.program?.type),
    start_at: new Date(event.start_at!),
    end_at: new Date(event.end_at!),
    capacity: event.capacity!,
    createdBy: {
      firstName: event.created_by!.first_name as string,
      id: event.created_by!.id as string,
      lastName: event.created_by!.last_name as string,
    },
    customers: event.customers?.map((customer: any) => ({
      email: customer.email,
      firstName: customer.first_name,
      gender: customer.gender,
      hasCancelledEnrollment: customer.has_cancelled_enrollment,
      id: customer.id,
      lastName: customer.last_name,
      phone: customer.phone,
    })) ?? [],
    location: {
      address: event.location!.address!,
      id: event.location!.id!,
      name: event.location!.name!,
    },
    program: {
      id: event.program!.id!,
      name: event.program!.name!,
      type: event.program!.type!,
    },
    staff: event.staff?.map((staff: any) => ({
      email: staff.email as string,
      firstName: staff.first_name as string,
      gender: staff.gender as string,
      id: staff.id as string,
      lastName: staff.last_name as string,
      phone: staff.phone as string,
      roleName: staff.role_name as string,
    })) ?? [],
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
    const events = await getEvents({
      after: '2024-01-01',
      before: '2026-02-01',
    });
    initialEvents = mapToCalendarEvents(events);
  } catch (error) {
    console.error('Error fetching events in Calendar:', error);
    initialEvents = [];
  }

  return (
  <RoleProtected allowedRoles={["ADMIN", "SUPERADMIN", "BARBER", "COACH", "INSTRUCTOR"]}>
    <CalendarPage initialEvents={initialEvents}/>
   </RoleProtected>
  );
}