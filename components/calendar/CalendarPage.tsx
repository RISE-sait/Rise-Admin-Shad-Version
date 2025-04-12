"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "@/components/reusable/RightDrawer";
import FilterComponent from "./Filter";
import { CalendarEvent, FiltersType } from "@/types/calendar";
import { useDrawer } from "@/hooks/drawer";
import CalendarDemo from "./components/calendar-demo";
import { getAllEvents } from "@/services/events";
import { format, addDays, subDays } from "date-fns";
import { colorOptions } from "./components/calendar/calendar-tailwind-classes";

interface CalendarPageProps {
  initialEvents: CalendarEvent[];
}

type EventQueryParams = {
  after: string;
  before: string;
  program_id?: string;
  user_id?: string;
  team_id?: string;
  location_id?: string;
  program_type?: string;
  created_by?: string;
  updated_by?: string;
};


export default function CalendarPage({ initialEvents }: CalendarPageProps) {
  // State for events, filtered events, and UI
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterOpen, setFilterOpen] = useState(true);
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer();
  const [isLoading, setIsLoading] = useState(false);

  // Default date range (current month +/- 30 days)
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const thirtyDaysLater = addDays(today, 30);

  // Updated filter structure to match Filter.tsx component
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
    
    // Frontend-only settings
    appointments: "both" // changed from 'booked' to match Filter.tsx options
  });

  // Fetch filtered events when filters change
  useEffect(() => {
    async function fetchFilteredEvents() {
      setIsLoading(true);
      
      try {
        // Then use this type
        const query: EventQueryParams = {
          after: filters.after,
          before: filters.before,
          program_id: filters.program_id || undefined,
          user_id: filters.user_id || undefined,
          team_id: filters.team_id || undefined,
          location_id: filters.location_id || undefined,
          program_type: filters.program_type || undefined,
          created_by: filters.created_by || undefined,
          updated_by: filters.updated_by || undefined
        };
        
        // The rest of your code remains the same
        Object.keys(query).forEach(key => {
          if (query[key as keyof EventQueryParams] === undefined) {
            delete query[key as keyof EventQueryParams];
          }
        });
        
        console.log("Fetching events with filters:", query);
        const eventsData = await getAllEvents(query);

        function getEventColor(programType?: string): string {
          switch (programType) {
            case 'practice':
              return colorOptions[1].value; // Assuming colorOptions is an array of color objects;
            case 'game':
              return colorOptions[0].value;
            case 'course':
              return colorOptions[2].value;
            default:
              return 'gray';
          }
        }

        const calendarEvents: CalendarEvent[] = eventsData.map(event => ({
          id: event.id || '',
          start_at: new Date(event.start_at),
          end_at: new Date(event.end_at),
          capacity: event.capacity || 0,
          color: event.color || getEventColor(event.program?.type),
          createdBy: {
            firstName: event.createdBy?.firstName || '',
            id: event.createdBy?.id || '',
            lastName: event.createdBy?.lastName || '',
          },
          customers: Array.isArray(event.customers) ? event.customers.map((c: any) => ({
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
          staff: Array.isArray(event.staff) ? event.staff.map((s: any) => ({
            email: s.email || '',
            firstName: s.first_name || '',
            gender: s.gender || '',
            id: s.id || '',
            lastName: s.last_name || '',
            phone: s.phone || '',
            roleName: s.role_name || '',
          })) : [],
          team: {
            id: event.team?.id || '',
            name: event.team?.name || '',
          },
          updatedBy: {
            firstName: event.updatedBy?.firstName || '',
            id: event.updatedBy?.id || '',
            lastName: event.updatedBy?.lastName || '',
          },
        }));
        
        // Now set the properly typed events
        setEvents(calendarEvents);
        
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Debounce the API calls to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchFilteredEvents();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Toggle filter sidebar
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Handle filter changes - updated to match Filter.tsx expectations
  const handleFilterChange = (key: keyof FiltersType, value: any) => {
    console.log(`Changing filter ${String(key)} to:`, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
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
      appointments: "both"
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={toggleFilter}>
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          {isLoading && <span className="text-sm">Loading events...</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-2">
        {/* Filter Sidebar */}
        {filterOpen && (
          <div className="w-1/4 mt-4">
            <FilterComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              resetFilters={resetFilters}
            />
          </div>
        )}
        {/* Calendar */}
        <div className={filterOpen ? "w-3/4" : "w-full"}>
          <CalendarDemo initialEvents={events} />
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