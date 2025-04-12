import type { CalendarProps } from '@/types/calendar'
import CalendarHeader from './header/calendar-header'
import CalendarBody from './body/calendar-body'
import CalendarHeaderActions from './header/actions/calendar-header-actions'
import CalendarHeaderDate from './header/date/calendar-header-date'
import CalendarHeaderActionsMode from './header/actions/calendar-header-actions-mode'
import CalendarHeaderActionsAdd from './header/actions/calendar-header-actions-add'
import CalendarProvider from './calendar-provider'
import { CalendarEvent } from '@/types/calendar'

export default function Calendar({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  onEventSelect,
}: CalendarProps) {
  return (
    <CalendarProvider
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
      calendarIconIsToday={calendarIconIsToday}
      onEventSelect={onEventSelect}
    >
      <CalendarHeader>
        <CalendarHeaderDate />
        <CalendarHeaderActions>
          <CalendarHeaderActionsMode />
          <CalendarHeaderActionsAdd />
        </CalendarHeaderActions>
      </CalendarHeader>
      <CalendarBody />
    </CalendarProvider>
  )
}