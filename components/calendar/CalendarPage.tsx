"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import FilterComponent from "./Filter";
import { CalendarEvent, Mode } from "@/types/calendar";
import Calendar from "./calendar";
import RightDrawer from "../reusable/RightDrawer";
import { getSchedule, PracticeResponseDto } from "@/services/schedule";
import { EventEventResponseDto, GameResponseDto } from "@/app/api/Api";
import { colorOptions } from "@/components/calendar/calendar-tailwind-classes";
import { fromZonedISOString } from "@/lib/utils";

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<Mode>("month");

  useEffect(() => {
    const fetchEventsForMonth = async () => {
      const month = format(date, "yyyy-MM");

      try {
        const { events, games, practices } = await getSchedule();
        const locationId = searchParams.get("location_id") || undefined;
        const programType = searchParams.get("program_type") || undefined;
        const programId = searchParams.get("program_id") || undefined;
        const participantId = searchParams.get("participant_id") || undefined;

        const filteredEvents = events.filter((event: EventEventResponseDto) => {
          const eventMonth = format(
            fromZonedISOString(event.start_at!),
            "yyyy-MM"
          );
          const matchesMonth = eventMonth === month;
          const matchesLocation =
            !locationId || event.location?.id === locationId;
          const matchesProgramType =
            !programType || event.program?.type === programType;
          const matchesProgramId =
            !programId || event.program?.id === programId;
          const matchesParticipant =
            !participantId ||
            event.customers?.some((c: any) => c.id === participantId);
          return (
            matchesMonth &&
            matchesLocation &&
            matchesProgramType &&
            matchesProgramId &&
            matchesParticipant
          );
        });

        const mappedEvents: CalendarEvent[] = filteredEvents.map((event) => {
          const membershipPlanIds = Array.isArray(
            event.required_membership_plan_ids
          )
            ? event.required_membership_plan_ids.filter(
                (planId): planId is string =>
                  typeof planId === "string" && planId.trim() !== ""
              )
            : [];

          return {
            id: event.id!,
            color: getColorFromProgramType(event.program?.type),
            start_at: fromZonedISOString(event.start_at!),
            end_at: fromZonedISOString(event.end_at!),
            capacity: event.capacity ?? 0,
            court: event.court
              ? {
                  id: event.court.id ?? "",
                  name: event.court.name ?? "",
                }
              : undefined,
            credit_cost:
              event.credit_cost != null && event.credit_cost !== ""
                ? Number(event.credit_cost)
                : undefined,

            price_id:
              event.price_id != null && event.price_id !== ""
                ? String(event.price_id)
                : undefined,
            required_membership_plan_ids:
              membershipPlanIds.length > 0 ? membershipPlanIds : undefined,
            createdBy: {
              firstName: event.created_by?.first_name ?? "",
              id: event.created_by?.id ?? "",
              lastName: event.created_by?.last_name ?? "",
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
              address: event.location?.address ?? "",
              id: event.location?.id ?? "",
              name: event.location?.name ?? "",
            },
            program: {
              id: event.program?.id ?? "",
              name: event.program?.name ?? "",
              type: event.program?.type ?? "",
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
          };
        });

        const filteredGames =
          !programType || programType === "game"
            ? games.filter(
                (g: GameResponseDto) =>
                  format(fromZonedISOString(g.start_time), "yyyy-MM") ===
                    month &&
                  (!locationId || g.location_id === locationId)
              )
            : [];

        const mappedGames: CalendarEvent[] = filteredGames.map(
          (g: GameResponseDto) => ({
            id: g.id!,
            start_at: fromZonedISOString(g.start_time),
            end_at: fromZonedISOString(g.end_time),
            capacity: 0,
            color: getColorFromProgramType("game"),
            createdBy: { firstName: "", id: "", lastName: "" },
            customers: [],
            location: {
              address: "",
              id: g.location_id,
              name: g.location_name,
            },
            court: {
              id: g.court_id ?? "",
              name: g.court_name ?? "",
            },
            program: {
              id: g.id!,
              name: `${g.home_team_name} vs ${g.away_team_name}`,
              type: "game",
            },
            staff: [],
            team: { id: "", name: "" },
            updatedBy: { firstName: "", id: "", lastName: "" },
          })
        );

        const filteredPractices =
          !programType || programType === "practice"
            ? practices.filter(
                (p: PracticeResponseDto) =>
                  format(fromZonedISOString(p.start_time), "yyyy-MM") ===
                    month &&
                  (!locationId || p.location_id === locationId)
              )
            : [];

        const mappedPractices: CalendarEvent[] = filteredPractices.map(
          (p: PracticeResponseDto) => ({
            id: p.id,
            start_at: fromZonedISOString(p.start_time),
            end_at: fromZonedISOString(p.end_time ?? p.start_time),
            capacity: 0,
            color: getColorFromProgramType("practice"),
            createdBy: { firstName: "", id: "", lastName: "" },
            customers: [],
            location: {
              address: "",
              id: p.location_id,
              name: p.location_name ?? "",
            },
            court: {
              id: p.court_id ?? "",
              name: p.court_name ?? "",
            },
            program: {
              id: p.team_id ?? p.id,
              name: p.team_name ?? "Practice",
              type: "practice",
            },
            staff: [],
            team: { id: p.team_id ?? "", name: p.team_name ?? "" },
            updatedBy: { firstName: "", id: "", lastName: "" },
          })
        );

        setCalendarEvents([
          ...mappedEvents,
          ...mappedGames,
          ...mappedPractices,
        ]);
      } catch (error) {
        console.error("Error fetching events:", error);
        setCalendarEvents([]);
      }
    };

    fetchEventsForMonth();
  }, [date, searchParams]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {calendarEvents.length} events
          </span>
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <RightDrawer
          drawerOpen={false}
          handleDrawerClose={() => setFilterOpen(false)}
        >
          <FilterComponent />
        </RightDrawer>

        {filterOpen && (
          <RightDrawer
            drawerOpen={filterOpen}
            handleDrawerClose={() => setFilterOpen(false)}
            drawerWidth="w-[40%]"
          >
            <FilterComponent />
          </RightDrawer>
        )}

        <div className="bg-white dark:bg-black shadow rounded-lg p-4 w-full">
          <Calendar
            events={calendarEvents}
            setEvents={setCalendarEvents}
            date={date}
            setDate={setDate}
            mode={mode}
            setMode={setMode}
            onEventSelect={(event) => setSelectedEvent(event)}
          />
        </div>
      </div>
    </div>
  );
}

function getColorFromProgramType(programType?: string): string {
  switch (programType) {
    case "course":
      return colorOptions[2].value;
    case "tournament":
      return colorOptions[0].value;
    case "tryouts":
      return colorOptions[1].value;
    case "event":
      return colorOptions[3].value;
    case "game":
      return colorOptions[0].value;
    case "practice":
      return colorOptions[1].value;
    default:
      return "gray";
  }
}
