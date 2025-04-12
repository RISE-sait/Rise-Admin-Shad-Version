import { createContext, useContext } from 'react'
import { CalendarContextType } from '@/types/calendar'

export const CalendarContext = createContext<CalendarContextType>({
  events: [],
  setEvents: () => {},
  mode: 'week',
  setMode: () => {},
  date: new Date(),
  setDate: () => {},
  calendarIconIsToday: true,
  newEventDialogOpen: false,
  setNewEventDialogOpen: () => {},
  manageEventDialogOpen: false,
  setManageEventDialogOpen: () => {},
  selectedEvent: null,
  setSelectedEvent: () => {},
  onEventSelect: undefined,  // Added this line
})

export const useCalendarContext = () => useContext(CalendarContext)