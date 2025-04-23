"use client"

import CalendarPage from '@/components/calendar/CalendarPage';
import { getEvents } from '@/services/events';
import { CalendarEvent } from '@/types/calendar';
import { colorOptions } from '@/components/calendar/calendar-tailwind-classes';
import { EventEventResponseDto } from '@/app/api/Api';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function mapToCalendarEvents(events: EventEventResponseDto[]): CalendarEvent[] {

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

export default function Calendar() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const fetchEvents = async () => {
      setIsLoading(true)
      
      try {         

        let before = searchParams.get('before') || ""
        let after = searchParams.get('after') || ""

        if (before === "" || after === "") {
          const beforeDate = new Date();
          beforeDate.setMonth(beforeDate.getMonth() + 1);
          before = beforeDate.toISOString().split("T")[0];
      
          const afterDate = new Date();
          afterDate.setMonth(afterDate.getMonth() - 1);
          after = afterDate.toISOString().split("T")[0];
        }

        const data = await getEvents({
          after: after,
          before: before,
          program_id: searchParams.get('program_id') || undefined,
          participant_id: searchParams.get('participant_id') || undefined,
          location_id: searchParams.get('location_id') || undefined,
          program_type: searchParams.get('program_type') || undefined,
          response_type: 'date'
        })
        setEvents(mapToCalendarEvents(data))
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [searchParams]) 

  return (
    <CalendarPage events={events} />
  );
}