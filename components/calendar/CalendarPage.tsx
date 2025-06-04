"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import FilterComponent from "./Filter";
import { CalendarEvent, Mode } from "@/types/calendar";
import Calendar from "./calendar";
import RightDrawer from "../reusable/RightDrawer";
import { getEventsByMonth } from "@/services/events";
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
        const events = await getEventsByMonth(month);
        const mappedEvents: CalendarEvent[] = events.map((event: any) => ({
          ...event,
          start_at: new Date(event.start_at),
          end_at: new Date(event.end_at),
          createdBy: event.createdBy ?? "",
          updatedBy: event.updatedBy ?? "",
          color: getColorFromProgramType(event.program?.type),
        }));

        setCalendarEvents(mappedEvents);
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
