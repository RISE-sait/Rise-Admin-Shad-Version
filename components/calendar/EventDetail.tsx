"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SchedulerEvent } from "../../types/calendar"

interface Attendee {
  name: string
  membership: string
  paid: boolean
}

export default function EventDetail({
  event,
  onClose,
}: {
  event: SchedulerEvent
  onClose: () => void
}) {
  const [tabValue, setTabValue] = useState("booked")

  const bookedAttendees: Attendee[] = [
    { name: "John Doe", membership: "Rise Full Year", paid: true },
    { name: "Jane Smith", membership: "Rise Monthly", paid: true },
  ]
  const cancelledAttendees: Attendee[] = [
    { name: "Max Johnson", membership: "Rise Bootcamp", paid: false },
  ]

  return (
    <div className="flex w-full h-full">
      {/* Left Side (70%) */}
      <div className="w-[70%] p-4 space-y-4 overflow-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Close
          </Button>
          <h2 className="text-lg font-semibold">Attendees</h2>
        </div>
        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList>
            <TabsTrigger value="booked">Booked ({bookedAttendees.length})</TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledAttendees.length})
            </TabsTrigger>
          </TabsList>
          <Separator className="my-2" />

          <TabsContent value="booked">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Member</th>
                  <th className="py-2 text-left font-medium">Membership</th>
                  <th className="py-2 text-left font-medium">Paid</th>
                  <th className="py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookedAttendees.map((attendee, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{attendee.name}</td>
                    <td className="py-2">{attendee.membership}</td>
                    <td className="py-2">{attendee.paid ? "Yes" : "No"}</td>
                    <td className="py-2">
                      <Button variant="outline" size="sm">
                        Check In
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
          <TabsContent value="cancelled">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Member</th>
                  <th className="py-2 text-left font-medium">Membership</th>
                  <th className="py-2 text-left font-medium">Paid</th>
                  <th className="py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cancelledAttendees.map((attendee, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{attendee.name}</td>
                    <td className="py-2">{attendee.membership}</td>
                    <td className="py-2">{attendee.paid ? "Yes" : "No"}</td>
                    <td className="py-2">
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </div>

      <Separator orientation="vertical" className="h-auto" />
      {/* Right Side (30%) */}
      <div className="w-[30%] p-4 space-y-4 overflow-auto">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">
          {event.start.toLocaleString()} - {event.end.toLocaleString()}
        </p>
        <Separator />
        <div className="space-y-1">
          <p className="text-sm">
            <strong>Trainer:</strong> Test Trainer
          </p>
          <p className="text-sm">
            <strong>Facility:</strong> Rise Facility - Calgary
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Class Actions</h4>
          <Button variant="default" size="sm" className="w-full">
            Book Member
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Edit this Event
          </Button>
          <Button variant="destructive" size="sm" className="w-full">
            Delete
          </Button>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Member Actions</h4>
          <Button variant="outline" size="sm" className="w-full">
            Check-in Everyone
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Send Group Message
          </Button>
        </div>
      </div>
    </div>
  )
}