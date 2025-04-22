"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "@/components/reusable/RightDrawer";
import FilterComponent from "./Filter";
import { CalendarEvent, FiltersType, Mode } from "@/types/calendar";
import { useDrawer } from "@/hooks/drawer";
import { getEvents } from "@/services/events";
import { format, addDays, subDays } from "date-fns";
import { colorOptions } from "./calendar-tailwind-classes";
import { useUser } from "@/contexts/UserContext";
import { EventEventResponseDto } from "@/app/api/Api";
import Calendar from "./calendar";

interface CalendarPageProps {
  events: CalendarEvent[];
}

export default function CalendarPage({ events }: CalendarPageProps) {
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterOpen, setFilterOpen] = useState(true);
  const { drawerOpen, drawerContent, closeDrawer } = useDrawer();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events || [])

  const [date, setDate] = useState<Date>(new Date())
  const [mode, setMode] = useState<Mode>('month')

  // Default date range (current month +/- 30 days)
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const thirtyDaysLater = addDays(today, 30);

  // Updated filter structure to include array filters
  const [filters, setFilters] = useState<FiltersType>({
    // Date filters
    after: format(thirtyDaysAgo, "yyyy-MM-dd"),
    before: format(thirtyDaysLater, "yyyy-MM-dd"),

    // Backend filters
    program_id: "",
    user_id: "",
    team_id: "",
    location_id: "",
    program_type: "",
    created_by: "",
    updated_by: "",

    // Multi-select arrays
    location_ids: [],
    user_ids: [],
    program_ids: [],
  });

  // Fetch filtered events when filters change
  useEffect(() => {
    async function fetchFilteredEvents() {
      setIsLoading(true);

      try {

        const eventsData = await getEvents({
          after: filters.after,
          before: filters.before,
          program_id: filters.program_id,
          user_id: filters.user_id,
          team_id: filters.team_id,
          location_id: filters.location_id,
          program_type: filters.program_type,
          created_by: filters.created_by,
          updated_by: filters.updated_by,
          response_type: "date",
        }) as EventEventResponseDto[];

        function getEventColor(programType?: string): string {
          switch (programType?.toLowerCase()) {
            case 'practice':
              return colorOptions[1].value;
            case 'game':
              return colorOptions[6].value;
            case 'course':
              return colorOptions[2].value;
            default:
              return 'gray';
          }
        }

        let calendarEvents: CalendarEvent[] = eventsData.map(event => ({
          id: event.id || '',
          start_at: new Date(event.start_at!),
          end_at: new Date(event.end_at!),
          capacity: event.capacity || 0,
          color: getEventColor(event.program?.type),
          createdBy: {
            firstName: event.created_by!.first_name!,
            id: event.created_by!.id || '',
            lastName: event.created_by!.last_name!,
          },
          customers: Array.isArray(event.customers) ? event.customers.map((c) => ({
            email: c.email || '',
            firstName: c.first_name || '',
            gender: c.gender || '',
            hasCancelledEnrollment: c.has_cancelled_enrollment || false,
            id: c.id || '',
            lastName: c.last_name || '',
            phone: c.phone || '',
          })) : [],
          location: {
            address: event.location?.address || '',
            id: event.location?.id || '',
            name: event.location?.name || '',
          },
          program: {
            id: event.program?.id || '',
            name: event.program?.name || '',
            type: event.program?.type || '',
          },
          staff: event.staff?.map((s) => ({
            email: s.email || '',
            firstName: s.first_name || '',
            gender: s.gender || '',
            id: s.id || '',
            lastName: s.last_name || '',
            phone: s.phone || '',
            roleName: s.role_name || '',
          })) ?? [],
          team: {
            id: event.team?.id || '',
            name: event.team?.name || '',
          },
          updatedBy: {
            firstName: event.updated_by!.first_name!,
            id: event.updated_by?.id!,
            lastName: event.updated_by?.last_name!,
          },
        }))

        setCalendarEvents(calendarEvents);

      } catch (error) {
        console.error("Error fetching events:", error);
        setCalendarEvents([]); // Clear events on error to provide visual feedback
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce the API calls to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchFilteredEvents();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, user]);

  const handleFilterChange = (key: keyof FiltersType, value: any) => {
    console.log(`Changing filter ${String(key)} to:`, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters - updated to include array filters
  const resetFilters = () => {
    setFilters({
      after: format(thirtyDaysAgo, "yyyy-MM-dd"),
      before: format(thirtyDaysLater, "yyyy-MM-dd"),
      program_id: "",
      user_id: "",
      team_id: "",
      location_id: "",
      program_type: "",
      created_by: "",
      updated_by: "",
      location_ids: [],
      user_ids: [],
      program_ids: [],
    });
  };

  // Handler for event selection
  const handleEventSelect = (event: CalendarEvent) => {
    console.log("Event selected:", event);
    setSelectedEvent(event);
    //openDrawer("details"); // Open the drawer with event details
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          {isLoading && <span className="text-sm">Loading events...</span>}
          <span className="text-sm text-muted-foreground">{calendarEvents.length} events</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-2">
        {/* Filter Sidebar */}
        {filterOpen && (
          <div className="w-2/12 mt-4">
            <FilterComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              resetFilters={resetFilters}
            />
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
            onEventSelect={handleEventSelect}
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