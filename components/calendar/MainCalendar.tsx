import CalendarDemo from '../calendar/components/calendar-demo'
import {  generateMockEvents } from '../../lib/mock-calendar-events'

export default function Home() {

  const mockEvents= generateMockEvents()
  return <CalendarDemo initialEvents={mockEvents} />
}