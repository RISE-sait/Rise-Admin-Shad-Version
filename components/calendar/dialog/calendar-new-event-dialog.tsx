import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { Calendar, FileText } from "lucide-react"

import RightDrawer from "@/components/reusable/RightDrawer"
import { useCalendarContext } from "../calendar-context"
import { Button } from "@/components/ui/button"
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
import { DateTimePicker } from "../form/date-time-picker"
import { ColorPicker } from "../form/color-picker"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

import { classSchema, facilitySchema } from "./event-schemas"
import { CalendarEvent } from "@/types/calendar"

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

  // function onSubmitClass(values: z.infer<typeof classSchema>) {
  //   const newEvent: CalendarEvent = {
  //     id: crypto.randomUUID(),
  //     program: {
  //       id: crypto.randomUUID(),
  //       name: values.title,
  //       type: "class",
  //     },
  //     start_at: new Date(values.start),
  //     end_at: new Date(values.end),
  //     color: values.color,
  //     // staff: {
  //     //   firstName: values.instructor,
  //     //   id: crypto.randomUUID(),
  //     //   lastName: "",
  //     // }
  //   }
  //   setEvents([...events, newEvent])
  //   handleClose()
  // }

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

  // function onSubmitFacility(values: z.infer<typeof facilitySchema>) {
  //   const newEvent: CalendarEvent = {
  //     id: crypto.randomUUID(),
  //     title: values.title,
  //     start: new Date(values.start),
  //     end: new Date(values.end),
  //     color: values.color,
  //     facilityId: values.facilityId,
  //     // Possibly add recurring info if showRecurringFacility is true
  //   }
  //   setEvents([...events, newEvent])
  //   handleClose()
  // }

  const handleClose = () => {
    setNewEventDialogOpen(false)
    classForm.reset()
    facilityForm.reset()
  }

  return (
    <>
      <RightDrawer drawerOpen={newEventDialogOpen} handleDrawerClose={handleClose} drawerWidth="w-[40%]">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold pb-4 border-b">Create New Event</h2>

          <Tabs value={eventType} onValueChange={(value) => setEventType(value as "class" | "facility")}>
            <div className="border-b mb-6">
              <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
              <TabsTrigger 
                value="class"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
              >
                <Calendar className="h-4 w-4" />
                Class
              </TabsTrigger>
              <TabsTrigger 
                value="facility"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
              >
                <FileText className="h-4 w-4" />
                Facility
              </TabsTrigger>
              </TabsList>
            </div>

            {/* ------------ Class Tab ------------ */}
            <TabsContent value="class" className="pt-4">
              <Form {...classForm}>
                <form
                  onSubmit={classForm.handleSubmit(()=>{})}
                  className="space-y-5"
                >
                  {/* Add recurring prompt at top */}
                  <div className="text-sm text-muted-foreground mb-2">
                      Create a single class or{" "}
                      <span 
                        className="text-primary cursor-pointer hover:underline font-medium"
                        onClick={() => setShowRecurringClassDrawer(true)}
                      >
                        click here for a recurring class
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
                            <SelectTrigger className="w-full">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={classForm.control}
                      name="start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
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
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <DateTimePicker field={field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectValue placeholder="Select instructor" />
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
                  </div>

                  <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Create Class
                  </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* ------------ Facility Tab ------------ */}
            <TabsContent value="facility" className="pt-4">
              <Form {...facilityForm}>
                <form
                  onSubmit={facilityForm.handleSubmit(()=>{})}
                  className="space-y-5"
                >
                  {/* Add recurring prompt at top */}
                  <div className="text-sm text-muted-foreground mb-2">
                    Create a single booking or{" "}
                    <span 
                      className="text-primary cursor-pointer hover:underline font-medium"
                      onClick={() => setShowRecurringFacilityDrawer(true)}
                    >
                      click here for a recurring booking
                    </span>
                  </div>

                  <FormField
                    control={facilityForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select facility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tennis Court Booking">
                                Tennis Court
                              </SelectItem>
                              <SelectItem value="Basketball Court Booking">
                                Basketball Court
                              </SelectItem>
                              <SelectItem value="Conference Room Reservation">
                                Conference Room
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={facilityForm.control}
                      name="start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
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
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <DateTimePicker field={field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectValue placeholder="Select ID" />
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
                  </div>

                  <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Book Facility
                  </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </RightDrawer>

      {/* Recurring Class Drawer */}
      <RightDrawer
        drawerOpen={showRecurringClassDrawer}
        handleDrawerClose={() => setShowRecurringClassDrawer(false)}
        drawerWidth="w-full md:max-w-3xl"
      >
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold pb-4 border-b">Create Recurring Class</h2>
          
          {/* Recurring Class form would go here */}
          <div className="pt-4 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowRecurringClassDrawer(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setShowRecurringClassDrawer(false)}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
            >
              Save
            </Button>
          </div>
        </div>
      </RightDrawer>

      {/* Recurring Facility Drawer */}
      <RightDrawer
        drawerOpen={showRecurringFacilityDrawer}
        handleDrawerClose={() => setShowRecurringFacilityDrawer(false)}
        drawerWidth="w-[75%]"
      >
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold pb-4 border-b">Create Recurring Facility Booking</h2>
          
          {/* Recurring Facility form would go here */}
          <div className="pt-4 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowRecurringFacilityDrawer(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setShowRecurringFacilityDrawer(false)}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
            >
              Save
            </Button>
          </div>
        </div>
      </RightDrawer>
    </>
  )
}