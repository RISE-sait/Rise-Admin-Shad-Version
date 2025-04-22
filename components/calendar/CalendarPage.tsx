"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "@/components/reusable/RightDrawer";
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
  const { drawerOpen, drawerContent, closeDrawer } = useDrawer();
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

      {/* Right Drawer */}
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={closeDrawer}
        drawerWidth="w-[50%]"
      >
        {drawerContent === "details" && selectedEvent && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              {selectedEvent.program?.name || "Unnamed Event"}
            </h2>
            <p className="mb-2"><strong>Start:</strong> {selectedEvent.start_at?.toLocaleString()}</p>
            <p className="mb-2"><strong>End:</strong> {selectedEvent.end_at?.toLocaleString()}</p>
            <p className="mb-2"><strong>Location:</strong> {selectedEvent.location?.name}</p>
            <p className="mb-2"><strong>Capacity:</strong> {selectedEvent.capacity}</p>
            {selectedEvent.staff && selectedEvent.staff.length > 0 && (
              <div className="mb-2">
                <strong>Staff:</strong>
                <ul className="ml-4 mt-1">
                  {selectedEvent.staff.map(s => (
                    <li key={s.id}>{s.firstName} {s.lastName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </RightDrawer>
    </div>
  );
}