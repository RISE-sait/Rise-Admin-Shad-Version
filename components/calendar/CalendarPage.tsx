"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import FilterComponent from "./Filter";
import { CalendarEvent, Mode } from "@/types/calendar";
import Calendar from "./calendar";
import RightDrawer from "../reusable/RightDrawer";
import { getEventsByMonth } from "@/services/events";
import { getAllGames } from "@/services/games";
import { getAllPractices } from "@/services/practices";
import { Game } from "@/types/games";
import { Practice } from "@/types/practice";
import { colorOptions } from "@/components/calendar/calendar-tailwind-classes";

interface CalendarPageProps {
  events: CalendarEvent[];
}

export default function CalendarPage({ events }: CalendarPageProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(
    events || []
  );
  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<Mode>("month");

  useEffect(() => {
    const fetchEventsForMonth = async () => {
      const month = format(date, "yyyy-MM");

      try {
        const [events, games, practices] = await Promise.all([
          getEventsByMonth(month),
          getAllGames(),
          getAllPractices(),
        ]);
        const mappedEvents: CalendarEvent[] = events.map((event: any) => ({
          ...event,
          start_at: new Date(event.start_at),
          end_at: new Date(event.end_at),
          createdBy: event.createdBy ?? "",
          updatedBy: event.updatedBy ?? "",
          color: getColorFromProgramType(event.program?.type),
        }));

        const monthGames: Game[] = games.filter(
          (g: Game) => format(new Date(g.start_time), "yyyy-MM") === month
        );

        const mappedGames: CalendarEvent[] = monthGames.map((g: Game) => ({
          id: g.id,
          start_at: new Date(g.start_time),
          end_at: new Date(g.end_time),
          capacity: 0,
          color: getColorFromProgramType("game"),
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

        const monthPractices: Practice[] = practices.filter(
          (p: Practice) => format(new Date(p.start_at), "yyyy-MM") === month
        );

        const mappedPractices: CalendarEvent[] = monthPractices.map(
          (p: Practice) => ({
            id: p.id,
            start_at: new Date(p.start_at),
            end_at: new Date(p.end_at),
            capacity: p.capacity,
            color: getColorFromProgramType("practice"),
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
  }, [date]);

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
    case "game":
      return colorOptions[0].value;
    case "practice":
      return colorOptions[1].value;
    case "course":
      return colorOptions[2].value;
    default:
      return "gray";
  }
}
