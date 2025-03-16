"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RightDrawer from "@/components/reusable/RightDrawer"
import FilterComponent from "../../../../components/calendar/Filter"
import MainCalendar from "../../../../components/calendar/MainCalendar"
import { SchedulerEvent, FiltersType } from "../../../../types/calendar"
import { useDrawer } from "../../../../hooks/drawer"

const initialEvents: SchedulerEvent[] = [
  {
    id: "1",
    title: "Event 1",
    description: "Initial event description",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    variant: "primary",
  },
  {
    id: "2",
    title: "Event 2",
    description: "Another event",
    start: new Date(),
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    variant: "default",
  },
]

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<SchedulerEvent | null>(null)
  const [filterOpen, setFilterOpen] = useState(true)
  const [filters, setFilters] = useState<FiltersType>({
    trainers: [
      { id: 1, name: "Test Trainer", checked: true },
      { id: 2, name: "Trainer 2", checked: false },
      { id: 3, name: "Trainer 3", checked: false },
    ],
    classes: [
      { id: 1, name: "Ball Handling", checked: true },
      { id: 2, name: "IQ/Footwork/Spacing", checked: true },
      { id: 3, name: "IQ/Situational Drills", checked: true },
      { id: 4, name: "OPEN GYM/DROP IN", checked: true },
      { id: 5, name: "RISE PERFORMANCE", checked: true },
      { id: 6, name: "Shooting Class", checked: true },
    ],
    appointments: "booked",
    facilities: [
      { id: 1, name: "Show booked", checked: false },
      { id: 2, name: "Show non-booked", checked: false },
      { id: 3, name: "Show both", checked: true },
      { id: 4, name: "Check out Tryout location", checked: true },
      { id: 5, name: "Online Facility", checked: false, warning: true },
      { id: 6, name: "Prolific Sports House", checked: true },
      { id: 7, name: "Rise Facility - Calgary", checked: false, warning: true },
      { id: 8, name: "The Genesis Centre", checked: false },
    ],
  })

  const [events, setEvents] = useState<SchedulerEvent[]>(initialEvents)
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer()

  const handleAddEvent = (newEvent: SchedulerEvent) => {
    setEvents((prev) => [...prev, newEvent])
  }

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  // 1) Expand the type
type FilterChangeType = keyof FiltersType | "settingsTimeFormat" | "settingsWeekStart"

const handleFilterChange = (type: FilterChangeType, value: string, checked: boolean) => {
  setFilters((prev) => {
    const updated = { ...prev }

    if (type === "settingsTimeFormat") {
      // store or handle the time format setting, for instance:
      // updated.timeFormat = value
      return updated
    } else if (type === "settingsWeekStart") {
      // store or handle the “weekStart” setting
      // updated.weekStart = value
      return updated
    }

    // otherwise handle normal FiltersType keys:
    if (type === "appointments") {
      updated.appointments = value as "booked" | "non-booked" | "both"
      return updated
    }
    if (type === "trainers") {
      updated.trainers = prev.trainers.map((t) =>
        t.name === value ? { ...t, checked } : t
      )
    } else if (type === "classes") {
      updated.classes = prev.classes.map((c) =>
        c.name === value ? { ...c, checked } : c
      )
    } else if (type === "facilities") {
      const radioNames = ["Show booked", "Show non-booked", "Show both"]
      if (radioNames.includes(value)) {
        updated.facilities = prev.facilities.map((f) =>
          radioNames.includes(f.name)
            ? { ...f, checked: f.name === value }
            : f
        )
      } else {
        updated.facilities = prev.facilities.map((f) =>
          f.name === value ? { ...f, checked } : f
        )
      }
    }

    return updated
  })
}

  // Example of toggling all facility checkboxes with IDs 4–8
  const toggleSelectAllFacilities = (isChecked: boolean) => {
    setFilters((prev) => {
      const updated = { ...prev }
      updated.facilities = updated.facilities.map((f, idx) =>
        idx >= 3 ? { ...f, checked: isChecked } : f
      )
      return updated
    })
  }

  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      trainers: prev.trainers.map((t) => ({ ...t, checked: false })),
      classes: prev.classes.map((c) => ({ ...c, checked: false })),
      appointments: "booked",
      facilities: prev.facilities.map((f) => ({ ...f, checked: false })),
    }))
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex">
          <Button variant="outline" onClick={toggleFilter}>
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-2">
        {/* Filter Sidebar */}
        {filterOpen && (
          <div className="w-1/6 mt-4">
            <FilterComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              toggleSelectAllFacilities={toggleSelectAllFacilities}
              resetFilters={resetFilters}
            />
          </div>
        )}
        {/* Calendar */}
        <div className={filterOpen ? "w-5/6" : "w-full"}>
          <MainCalendar />
        </div>
      </div>
    </div>
  )
}