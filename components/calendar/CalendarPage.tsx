"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FilterComponent from "./Filter";
import { CalendarEvent, Mode } from "@/types/calendar";
import { useDrawer } from "@/hooks/drawer";
import Calendar from "./calendar";

interface CalendarPageProps {
  events: CalendarEvent[];
}

export default function CalendarPage({ events }: CalendarPageProps) {

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterOpen, setFilterOpen] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events || [])

  const [date, setDate] = useState<Date>(new Date())
  const [mode, setMode] = useState<Mode>('month')

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          <span className="text-sm text-muted-foreground">{calendarEvents.length} events</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-2">
        {/* Filter Sidebar */}
        {filterOpen && (
          <div className="w-2/12">
            <FilterComponent />
          </div>
        )}
        {/* Calendar */}
        <div className={`bg-white dark:bg-black shadow rounded-lg p-4 ${filterOpen ? "w-10/12" : "w-full"}`}>
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