import { CalendarContext } from './calendar-context'
import { CalendarEvent, Mode } from '@/types/calendar'
import { useState } from 'react'
import CalendarNewEventDialog from './dialog/calendar-new-event-dialog'
import CalendarManageEventDialog from './dialog/calendar-manage-event-drawer'

export default function CalendarProvider({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  onEventSelect,
  children,
}: {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday: boolean
  onEventSelect?: (event: CalendarEvent) => void
  children: React.ReactNode
}) {
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false)
  const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  return (
    <CalendarContext.Provider
      value={{
        events,
        setEvents,
        mode,
        setMode,
        date,
        setDate,
        calendarIconIsToday,
        newEventDialogOpen,
        setNewEventDialogOpen,
        manageEventDialogOpen,
        setManageEventDialogOpen,
        selectedEvent,
        setSelectedEvent,
        onEventSelect,  // Pass through the event handler
      }}
    >
      <CalendarNewEventDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  )
}