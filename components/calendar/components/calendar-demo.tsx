'use client'

import { useState } from 'react'
import Calendar from './calendar/calendar'
import { CalendarEvent, Mode } from './calendar/calendar-types'

export default function CalendarDemo({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [mode, setMode] = useState<Mode>('month')
  const [date, setDate] = useState<Date>(new Date())

  return (
    <Calendar
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  )
}
