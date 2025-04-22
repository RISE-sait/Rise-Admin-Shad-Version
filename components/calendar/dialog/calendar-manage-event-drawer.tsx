"use client"

import { useMemo, useState, useEffect } from "react"
import * as React from "react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "../form/date-time-picker"
import { ColorPicker } from "../form/color-picker"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, MoreVertical } from "lucide-react"
import RightDrawer from "@/components/reusable/RightDrawer"
import { useCalendarContext } from "../calendar-context"

// ----------------- ATTENDEE TYPE -----------------
type Attendee = {
  name: string
  email: string
  phone: string
  membership: string
  expiry?: string
  paid: boolean
  profileImage?: string
}

// ----------------- AttendeesTable Component -----------------
// This component uses TanStack React Table along with our UI Table components.
// It implements search (filtering on the "name" column), a columns dropdown, and sorting.
function AttendeesTable({ data }: { data: Attendee[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns = useMemo<ColumnDef<Attendee>[]>(() => [
    {
      accessorKey: "profile",
      header: "Profile",
      cell: ({ row }) => (
        <Avatar className="rounded-full h-12 w-12">
          <AvatarImage
            src={row.original.profileImage || ""}
            alt={row.original.name}
          />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="text-base font-semibold">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
          <div className="text-sm text-muted-foreground">{row.original.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: "membership",
      header: "Membership",
      cell: ({ row }) => (
        <div>
          <div className="text-base font-medium">{row.original.membership}</div>
          {row.original.expiry && (
            <div className="text-sm text-muted-foreground">{row.original.expiry}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "paid",
      header: "Paid",
      cell: ({ row }) =>
        row.original.paid ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
        ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.name)}
              className="text-red-500"
            >
              Remove From Event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send Message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      {/* Header: Search Input and Columns Dropdown */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter members..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-24"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ----------------- MAIN COMPONENT -----------------
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

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     title: "",
  //     start: "",
  //     end: "",
  //     color: "blue",
  //   },
  // })

  // useEffect(() => {
  //   if (selectedEvent) {
  //     form.reset({
  //       title: selectedEvent.program.name,
  //       start: format(selectedEvent.start_at, "yyyy-MM-dd'T'HH:mm"),
  //       end: format(selectedEvent.end_at, "yyyy-MM-dd'T'HH:mm"),
  //       color: selectedEvent.color,
  //     })
  //   }
  // }, [selectedEvent, form])

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   if (!selectedEvent) return

  //   const updatedEvent = {
  //     ...selectedEvent,
  //     title: values.title,
  //     start: new Date(values.start),
  //     end: new Date(values.end),
  //     color: values.color,
  //   }

  //   setEvents(
  //     events.map((event) =>
  //       event.id === selectedEvent.id ? updatedEvent : event
  //     )
  //   )
  //   setShowEditForm(false)
  // }

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

  // ----------------- DUMMY DATA -----------------
  // Generate 20 dummy rows for booked and cancelled attendees.
  const bookedAttendees: Attendee[] = Array.from({ length: 20 }, (_, i) => ({
    name: `Booked Attendee ${i + 1}`,
    email: `booked${i + 1}@example.com`,
    phone: `555-000-${String(i + 1).padStart(4, "0")}`,
    membership: i % 2 === 0 ? "Full Year" : "Monthly",
    expiry: i % 3 === 0 ? "Expires in 8 months" : "Expires in 6 months",
    paid: i % 2 === 0,
    profileImage: "",
  }))

  const cancelledAttendees: Attendee[] = Array.from({ length: 20 }, (_, i) => ({
    name: `Cancelled Attendee ${i + 1}`,
    email: `cancelled${i + 1}@example.com`,
    phone: `555-100-${String(i + 1).padStart(4, "0")}`,
    membership: "Cancelled Membership",
    expiry: "",
    paid: false,
    profileImage: "",
  }))

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
            Sunday 03/02/2025, 5:00 pm - 11:00 pm
          </p>
          <p className="text-base text-muted-foreground">Test Trainer</p>
          <p className="text-base text-muted-foreground">
            Rise Facility - Calgary Central
          </p>
          <p className="text-base text-muted-foreground">{selectedEvent?.location.name}</p>

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
