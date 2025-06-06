import { useCalendarContext } from "../../calendar-context";
import { isWithinInterval } from "date-fns";
import { hours } from "./calendar-body-margin-day-margin";
import CalendarBodyHeader from "../calendar-body-header";
import CalendarEvent from "../../event/calendar-event";

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events } = useCalendarContext();

  const dayEvents = events.filter((event) =>
    isWithinInterval(date, { start: event.start_at, end: event.end_at })
  );

  return (
    <div className="flex flex-col flex-grow">
      <CalendarBodyHeader date={date} />

      <div className="flex-1 relative">
        {hours.map((hour) => (
          <div key={hour} className="h-32 border-b border-border/50 group" />
        ))}

        {dayEvents.map((event) => (
          <CalendarEvent key={event.id} event={event} currentDate={date} />
        ))}
      </div>
    </div>
  );
}
