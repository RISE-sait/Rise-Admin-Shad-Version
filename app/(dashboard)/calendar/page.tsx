"use client";

import CalendarPage from "@/components/calendar/CalendarPage";
import { getEvents } from "@/services/events";
import { getAllGames } from "@/services/games";
import { getAllPractices } from "@/services/practices";
import { CalendarEvent } from "@/types/calendar";
import { Game } from "@/types/games";
import { Practice } from "@/types/practice";
import { colorOptions } from "@/components/calendar/calendar-tailwind-classes";
import { EventEventResponseDto } from "@/app/api/Api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
function mapToCalendarEvents(events: EventEventResponseDto[]): CalendarEvent[] {
  return (
    events.map((event) => ({
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
      customers:
        event.customers?.map((customer: any) => ({
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
      staff:
        event.staff?.map((staff: any) => ({
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
    })) || []
  );
}

function mapGamesToCalendarEvents(games: Game[]): CalendarEvent[] {
  return games.map((g) => ({
    id: g.id,
    color: getEventColor("game"),
    start_at: new Date(g.start_time),
    end_at: new Date(g.end_time),
    capacity: 0,
    createdBy: { firstName: "", id: "", lastName: "" },
    customers: [],
    location: { address: "", id: g.location_id, name: g.location_name },
    program: {
      id: g.id,
      name: `${g.home_team_name} vs ${g.away_team_name}`,
      type: "game",
    },
    staff: [],
    team: { id: "", name: "" },
    updatedBy: { firstName: "", id: "", lastName: "" },
  }));
}

function mapPracticesToCalendarEvents(practices: Practice[]): CalendarEvent[] {
  return practices.map((p) => ({
    id: p.id,
    color: getEventColor("practice"),
    start_at: new Date(p.start_at),
    end_at: new Date(p.end_at),
    capacity: p.capacity,
    createdBy: { firstName: "", id: "", lastName: "" },
    customers: [],
    location: {
      address: "",
      id: p.location_id ?? "",
      name: p.location_name ?? "",
    },
    program: {
      id: p.program_id ?? p.id,
      name: p.program_name || "Practice",
      type: "practice",
    },
    staff: [],
    team: { id: p.team_id ?? "", name: p.team_name ?? "" },
    updatedBy: { firstName: "", id: "", lastName: "" },
  }));
}

function getEventColor(programType?: string): string {
  switch (programType) {
    case "practice":
      return colorOptions[1].value; // Assuming colorOptions is an array of color objects;
    case "game":
      return colorOptions[0].value;
    case "course":
      return colorOptions[2].value;
    default:
      return "gray";
  }
}

export default function Calendar() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);

      try {
        let before = searchParams.get("before") || "";
        let after = searchParams.get("after") || "";

        const locationId = searchParams.get("location_id") || undefined;
        const programType = searchParams.get("program_type") || undefined;

        if (before === "" || after === "") {
          const beforeDate = new Date();
          beforeDate.setMonth(beforeDate.getMonth() + 1);
          before = beforeDate.toISOString().split("T")[0];

          const afterDate = new Date();
          afterDate.setMonth(afterDate.getMonth() - 1);
          after = afterDate.toISOString().split("T")[0];
        }

        const [eventData, gamesData, practicesData] = await Promise.all([
          getEvents({
            after: after,
            before: before,
            program_id: searchParams.get("program_id") || undefined,
            participant_id: searchParams.get("participant_id") || undefined,
            location_id: locationId,
            program_type: programType,
            response_type: "date",
          }),
          getAllGames(),
          getAllPractices(),
        ]);

        let calendarEvents = mapToCalendarEvents(eventData);

        if (!programType || programType === "practice") {
          const filteredPractices = practicesData.filter((p: Practice) => {
            const practiceDate = new Date(p.start_at);
            return (
              practiceDate >= new Date(after) &&
              practiceDate <= new Date(before) &&
              (!locationId || p.location_id === locationId)
            );
          });
          calendarEvents = [
            ...calendarEvents,
            ...mapPracticesToCalendarEvents(filteredPractices),
          ];
        }

        if (!programType || programType === "game") {
          const filteredGames = gamesData.filter((g: Game) => {
            const gameDate = new Date(g.start_time);
            return (
              gameDate >= new Date(after) &&
              gameDate <= new Date(before) &&
              (!locationId || g.location_id === locationId)
            );
          });
          calendarEvents = [
            ...calendarEvents,
            ...mapGamesToCalendarEvents(filteredGames),
          ];
        }

        calendarEvents.sort(
          (a, b) => a.start_at.getTime() - b.start_at.getTime()
        );

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  return <CalendarPage events={events} />;
}
