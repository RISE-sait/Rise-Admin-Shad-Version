"use client"

import { useEffect, useState } from "react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle } from "lucide-react"
import RightDrawer from "@/components/reusable/RightDrawer"
import { useCalendarContext } from "../calendar-context"
import AttendeesTable from "./manage/AttendeesTable"
import { getEvent } from "@/services/events"
import { EventParticipant } from "@/types/events"


export default function CalendarManageEventDrawer() {
  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents,
  } = useCalendarContext()

  const [showEditForm, setShowEditForm] = useState(false)
  const [event, setEvent] = useState(selectedEvent)

  const [participants, setParticipants] = useState<EventParticipant[]>([])

  useEffect(() => {
    async function fetchData() {
      if (selectedEvent) {

        const event = await getEvent(selectedEvent.id)

        setEvent(selectedEvent)
        setParticipants(event.customers)
      }
    }

    fetchData()
  }, [selectedEvent])

  const bookedAttendees = participants.filter((attendee) => !attendee.has_cancelled_enrollment)
  const cancelledAttendees = participants.filter((attendee) => attendee.has_cancelled_enrollment)

  function handleDelete() {
    if (!selectedEvent) return
    setEvents(events.filter((event) => event.id !== selectedEvent.id))
    handleClose()
  }

  function handleClose() {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
    // form.reset()
    setShowEditForm(false)
  }

  return (
    <RightDrawer
      drawerOpen={manageEventDialogOpen}
      handleDrawerClose={handleClose}
      drawerWidth="w-[75%]"
    >
      <div className="flex h-full">
        {/* Left Section (70%) */}
        <div className="w-[70%] border-r">
          <Tabs defaultValue="booked" className="w-full">
            {/* Tab List now shows the actual count */}
            <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
              <TabsTrigger
                value="booked"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                {bookedAttendees.length} Booked
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
              >
                <XCircle className="h-4 w-4" />
                {cancelledAttendees.length} Cancelled
              </TabsTrigger>
            </TabsList>

            {/* Booked Attendees Table */}
            <TabsContent value="booked" className="mt-2">
              <AttendeesTable data={bookedAttendees} />
            </TabsContent>

            {/* Cancelled Attendees Table */}
            <TabsContent value="cancelled" className="mt-2">
              <AttendeesTable data={cancelledAttendees} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Section */}
        <div className="w-[30%] p-6 space-y-6">
          <h1 className="text-xl font-semibold">
            {selectedEvent?.program.name || "Unnamed Event"}
          </h1>
          <p className="text-base text-muted-foreground">
            Date: {selectedEvent?.start_at.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <p className="text-base text-muted-foreground">
            Start Time: {selectedEvent?.start_at.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-base text-muted-foreground">

            End Time: {selectedEvent?.end_at.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-base text-muted-foreground">
            {selectedEvent?.location.name}          </p>
          <p className="text-base text-muted-foreground">{selectedEvent?.location.address}</p>

          <Separator />

          <div className="space-y-4">
            <Button variant="default" className="w-full">
              Book Member
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowEditForm(!showEditForm)}
            >
              Edit this Event
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this event? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" className="w-full">
              Send Group Message
            </Button>
            <Button variant="outline" className="w-full">
              Check-in Everyone
            </Button>
            <Button variant="outline" className="w-full">
              Download CSV
            </Button>
          </div>

          {/* {showEditForm && (
            <div className="mt-6 space-y-6">
              <Separator />
              <h2 className="text-lg font-semibold">Edit Event</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start</FormLabel>
                        <FormControl>
                          <DateTimePicker field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End</FormLabel>
                        <FormControl>
                          <DateTimePicker field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <ColorPicker field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full" type="submit">
                    Update Event
                  </Button>
                </form>
              </Form>
            </div>
          )} */}
        </div>
      </div>
    </RightDrawer>
  )
}
