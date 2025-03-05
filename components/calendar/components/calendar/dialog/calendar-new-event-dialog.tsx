import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"

import RightDrawer from "@/components/reusable/RightDrawer"
import { useCalendarContext } from "../calendar-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { DateTimePicker } from "../../form/date-time-picker"
import { ColorPicker } from "../../form/color-picker"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../ui/tabs"

import { classSchema, facilitySchema } from "./event-schemas"

export default function CalendarNewEventDrawer() {
  const { newEventDialogOpen, setNewEventDialogOpen, date, events, setEvents } =
    useCalendarContext()

  // Which tab the user is on
  const [eventType, setEventType] = useState<"class" | "facility">("class")

  // Separate toggles for recurring class vs. facility
  const [showRecurringClassDrawer, setShowRecurringClassDrawer] = useState(false)
  const [showRecurringFacilityDrawer, setShowRecurringFacilityDrawer] = useState(false)

  // Class form
  const classForm = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      title: "",
      start: format(date, "yyyy-MM-dd'T'HH:mm"),
      end: format(date, "yyyy-MM-dd'T'HH:mm"),
      color: "blue",
      instructor: "",
    },
  })

  function onSubmitClass(values: z.infer<typeof classSchema>) {
    const newEvent = {
      id: crypto.randomUUID(),
      title: values.title,
      start: new Date(values.start),
      end: new Date(values.end),
      color: values.color,
      instructor: values.instructor,
      // Possibly add recurring info if showRecurringClass is true
    }
    setEvents([...events, newEvent])
    handleClose()
  }

  // Facility form
  const facilityForm = useForm<z.infer<typeof facilitySchema>>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      title: "",
      start: format(date, "yyyy-MM-dd'T'HH:mm"),
      end: format(date, "yyyy-MM-dd'T'HH:mm"),
      color: "blue",
      facilityId: "",
    },
  })

  function onSubmitFacility(values: z.infer<typeof facilitySchema>) {
    const newEvent = {
      id: crypto.randomUUID(),
      title: values.title,
      start: new Date(values.start),
      end: new Date(values.end),
      color: values.color,
      facilityId: values.facilityId,
      // Possibly add recurring info if showRecurringFacility is true
    }
    setEvents([...events, newEvent])
    handleClose()
  }

  const handleClose = () => {
    setNewEventDialogOpen(false)
    classForm.reset()
    facilityForm.reset()
  }

  return (
    <>
    <RightDrawer drawerOpen={newEventDialogOpen} handleDrawerClose={handleClose} drawerWidth="w-[25%]" >
      <div className="p-6 space-y-4">
        <h2 className="scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight mb-4">
          Choose your event type
        </h2>

        <Tabs
          value={eventType}
          onValueChange={(value) => setEventType(value as "class" | "facility")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="class">
              Class
            </TabsTrigger>
            <TabsTrigger value="facility">
              Facility
            </TabsTrigger>
          </TabsList>

          {/* ------------ Class Tab ------------ */}
          <TabsContent value="class" className="w-full max-w-md mx-auto">
            <Form {...classForm}>
              <form
                onSubmit={classForm.handleSubmit(onSubmitClass)}
                className="space-y-4"
              >
                {/* Add recurring prompt at top */}
                <div className="text-sm mt-4 text-muted-foreground">
                    You can create a single class below, or{" "}
                    <span 
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => setShowRecurringClassDrawer(true)}
                    >
                      click here to create a recurring class
                    </span>
                  </div>
                <FormField
                  control={classForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Title</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class title" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yoga Basics">Yoga Basics</SelectItem>
                            <SelectItem value="Pilates">Pilates</SelectItem>
                            <SelectItem value="Spin Class">Spin Class</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classForm.control}
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
                  control={classForm.control}
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
                  control={classForm.control}
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

                <FormField
                  control={classForm.control}
                  name="instructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Instructor name" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                
                  {/* Modified buttons section */}
                  <div className="flex space-x-2">
                    <Button type="submit" className="w-full mt-4">
                      Create {eventType === "class" ? "Class" : "Appointment"}
                    </Button>
                  </div>
              </form>
            </Form>
          </TabsContent>

          {/* ------------ Facility Tab ------------ */}
          <TabsContent value="facility" className="w-full max-w-md mx-auto">
            <Form {...facilityForm}>
              <form
                onSubmit={facilityForm.handleSubmit(onSubmitFacility)}
                className="space-y-4"
              >

                {/* Add recurring prompt at top */}
                <div className="text-sm text-muted-foreground mt-4">
                    You can create a single facility booking below, or{" "}
                    <span 
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => setShowRecurringFacilityDrawer(true)}
                    >
                      click here to create a recurring booking
                    </span>
                  </div>
                <FormField
                  control={facilityForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Name</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Facility Name" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tennis Court Booking">
                              Tennis Court Booking
                            </SelectItem>
                            <SelectItem value="Basketball Court Booking">
                              Basketball Court Booking
                            </SelectItem>
                            <SelectItem value="Conference Room Reservation">
                              Conference Room Reservation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={facilityForm.control}
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
                  control={facilityForm.control}
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
                  control={facilityForm.control}
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

                <FormField
                  control={facilityForm.control}
                  name="facilityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility ID</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick facility ID" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="101">101</SelectItem>
                            <SelectItem value="102">102</SelectItem>
                            <SelectItem value="103">103</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Modified buttons section */}
                <div className="flex  space-x-2">
                    <Button type="submit" className="w-full mt-4">
                      Create {eventType === "class" ? "Class" : "Appointment"}
                    </Button>
                  </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </RightDrawer>

  {/* Separate drawer for recurring class */}
    <RightDrawer
    drawerOpen={showRecurringClassDrawer}
    handleDrawerClose={() => setShowRecurringClassDrawer(false)}
    drawerWidth="w-[70%] min-w-[400px]"
  >
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Recurring Class Setup</h2>
      {/* Recurring Class fields */}
      {/* ... */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowRecurringClassDrawer(false)}>
          Cancel
        </Button>
        <Button onClick={() => setShowRecurringClassDrawer(false)}>
          Save
        </Button>
      </div>
    </div>
  </RightDrawer>

  {/* Separate drawer for recurring facility */}
  <RightDrawer
    drawerOpen={showRecurringFacilityDrawer}
    handleDrawerClose={() => setShowRecurringFacilityDrawer(false)}
    drawerWidth="w-[70%] min-w-[400px]"
  >
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Recurring Facility Setup</h2>
      {/* Recurring Facility fields */}
      {/* ... */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowRecurringFacilityDrawer(false)}>
          Cancel
        </Button>
        <Button onClick={() => setShowRecurringFacilityDrawer(false)}>
          Save
        </Button>
      </div>
    </div>
  </RightDrawer>
  </>
  )
}