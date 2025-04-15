"use client"

import { useEffect, useState } from "react"
import Calendar from "./calendar/calendar"
import { CalendarEvent } from "@/types/calendar"
import { Mode } from "@/types/calendar"

interface CalendarDemoProps {
  events: CalendarEvent[],
  onEventSelect?: (event: CalendarEvent) => void
}

export default function CalendarDemo({ events, onEventSelect }: CalendarDemoProps) {
  // Initialize calendar display state
  const [date, setDate] = useState<Date>(new Date())
  const [mode, setMode] = useState<Mode>('month')
  
  // Internal state to manage events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events || [])

  // This is the critical part - update internal state whenever the events prop changes
  useEffect(() => {
    setCalendarEvents(events);
  }, [events]); // This dependency ensures the effect runs when events change

  return (
    <div className="bg-white dark:bg-black shadow rounded-lg p-4">
      <Calendar 
        events={calendarEvents} 
        setEvents={setCalendarEvents}
        date={date}
        setDate={setDate}
        mode={mode}
        setMode={setMode}
        onEventSelect={onEventSelect}
      />
    </div>
  )
}