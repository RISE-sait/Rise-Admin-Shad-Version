"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FilterComponent from "./Filter";
import { CalendarEvent, Mode } from "@/types/calendar";
import Calendar from "./calendar";
import RightDrawer from "../reusable/RightDrawer";

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

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {events.length} events
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-2">
        {/* Filter Sidebar */}
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

        {/* Calendar */}
        <div
          className={`bg-white dark:bg-black shadow rounded-lg p-4 w-full`} // ${filterOpen ? "w-10/12" : "w-full"}
        >
          <Calendar
            events={events}
            setEvents={() => {}}
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
