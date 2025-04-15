import type { CalendarProps } from '@/types/calendar'
import CalendarHeader from './header/calendar-header'
import CalendarBody from './body/calendar-body'
import CalendarHeaderActions from './header/actions/calendar-header-actions'
import CalendarHeaderDate from './header/date/calendar-header-date'
import CalendarHeaderActionsMode from './header/actions/calendar-header-actions-mode'
import CalendarHeaderActionsAdd from './header/actions/calendar-header-actions-add'
import CalendarProvider from './calendar-provider'

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
      {/* Main container with fixed height and no overflow */}
      <div className="flex flex-col max-h-[calc(100vh-180px)] overflow-hidden">
        {/* Header - fixed at the top */}
        <div className="flex-shrink-0">
          <CalendarHeader>
            <CalendarHeaderDate />
            <CalendarHeaderActions>
              <CalendarHeaderActionsMode />
              <CalendarHeaderActionsAdd />
            </CalendarHeaderActions>
          </CalendarHeader>
        </div>
        
        {/* Body - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <CalendarBody />
        </div>
      </div>
    </CalendarProvider>
  )
}