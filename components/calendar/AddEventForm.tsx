"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SchedulerEvent } from "../../types/calendar"
import RightDrawer from "@/components/reusable/RightDrawer"

export default function AddEventForm({
  onClose,
  onAddEvent,
  drawerOpen,
}: {
  onClose: () => void
  onAddEvent: (event: SchedulerEvent) => void
  drawerOpen: boolean
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSubmit = () => {
    const newEvent: SchedulerEvent = {
      id: String(Date.now()),
      title,
      description,
      start: startDate ? new Date(startDate) : new Date(),
      end: endDate ? new Date(endDate) : new Date(),
      variant: "primary", // or default, success, etc.
    }
    onAddEvent(newEvent)
    onClose()
  }

  return (
    <RightDrawer drawerOpen={drawerOpen} handleDrawerClose={onClose} >
      <div className="p-6 space-y-4">
        <Input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="datetime-local"
          placeholder="Start date/time"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="datetime-local"
          placeholder="End date/time"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button onClick={handleSubmit}>Create</Button>
      </div>
    </RightDrawer>
  )
}