import { useCalendarContext } from '../calendar-context'
import CalendarBodyDay from './day/calendar-body-day'
import CalendarBodyWeek from './week/calendar-body-week'
import CalendarBodyMonth from './month/calendar-body-month'

export default function CalendarBody() {
  const { mode } = useCalendarContext()

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] overflow-hidden">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'day' && <CalendarBodyDay />}
        {mode === 'week' && <CalendarBodyWeek />}
        {mode === 'month' && <CalendarBodyMonth />}
      </div>
    </div>
  )
}