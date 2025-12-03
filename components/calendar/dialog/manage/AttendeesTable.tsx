"use client";

import { useCallback, useMemo, useState } from "react";
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
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Search,
  UserPlus,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EventParticipant } from "@/types/events";
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
} from "@/components/ui/alert-dialog";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { removeCustomerFromEvent } from "@/services/events";

interface AttendeesTableProps {
  eventId: string;
  data: EventParticipant[];
  capacity?: number;
  onCustomerRemoved: (customerId: string) => Promise<void>;
}

export default function AttendeesTable({
  eventId,
  data,
  capacity,
  onCustomerRemoved,
}: AttendeesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const handleRemoveAttendee = useCallback(
    async (attendee: EventParticipant) => {
      if (!user?.Jwt) {
        toast({
          status: "error",
          description: "You must be signed in to remove attendees.",
          variant: "destructive",
        });
        return false;
      }

      try {
        setPendingRemovalId(attendee.id);
        await removeCustomerFromEvent(eventId, attendee.id, user.Jwt);
        toast({
          status: "success",
          description: `${attendee.first_name} ${attendee.last_name} removed from event.`,
        });
        await onCustomerRemoved(attendee.id);
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to remove attendee.";

        toast({
          status: "error",
          description: message,
          variant: "destructive",
        });
        return false;
      } finally {
        setPendingRemovalId(null);
      }
    },
    [eventId, onCustomerRemoved, toast, user?.Jwt]
  );

  const columns = useMemo<ColumnDef<EventParticipant>[]>(
    () => [
      {
        accessorKey: "profile",
        header: "Profile",
        cell: ({ row }) => (
          <Avatar className="rounded-full h-12 w-12">
            {/* <AvatarImage
                        src={""}
                        alt={row.original.first_name + " " + row.original.last_name}
                    /> */}
            <AvatarFallback>{row.original.first_name.charAt(0)}</AvatarFallback>
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
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-base font-semibold w-fit">
            {row.original.first_name} {row.original.last_name}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground max-w-24 overflow-x-clip">
            {row.original.email}
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.phone}
          </div>
        ),
      },
      // {
      //     accessorKey: "membership",
      //     header: "Membership",
      //     cell: ({ row }) => (
      //         <div>
      //             <div className="text-base font-medium">{row.original.membership}</div>
      //             {row.original.expiry && (
      //                 <div className="text-sm text-muted-foreground">{row.original.expiry}</div>
      //             )}
      //         </div>
      //     ),
      // },
      // {
      //     accessorKey: "paid",
      //     header: "Paid",
      //     cell: ({ row }) =>
      //         row.original.paid ? (
      //             <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
      //         ) : (
      //             <XCircle className="h-5 w-5 text-red-500 mx-auto" />
      //         ),
      // },
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => (
          <AttendeeActions
            attendee={row.original}
            onConfirm={handleRemoveAttendee}
            pendingRemovalId={pendingRemovalId}
          />
        ),
      },
    ],
    [handleRemoveAttendee, pendingRemovalId]
  );

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
  });

  return (
    <Card className="border-l-4 border-l-yellow-500">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Event Attendees</h3>
          </div>
          <div className="text-sm font-medium">
            {capacity !== undefined && capacity > 0 ? (
              <>
                <span className={data.length >= capacity ? "text-red-500" : "text-muted-foreground"}>
                  {data.length} / {capacity}
                </span>
                <span className="text-muted-foreground ml-2">
                  ({capacity - data.length} spots remaining)
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">
                {data.length} registered
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          View and manage customers registered for this event.
        </p>

        {data.length > 0 ? (
          <div className="w-full space-y-4">
            {/* Header: Search Input and Columns Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter members..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="pl-9 bg-background"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Table */}
            <div className="rounded-lg border bg-background">
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
                        className="h-20 hover:bg-muted/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-muted-foreground bg-muted/30 rounded-lg">
            No attendees registered for this event yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AttendeeActions({
  attendee,
  onConfirm,
  pendingRemovalId,
}: {
  attendee: EventParticipant;
  onConfirm: (attendee: EventParticipant) => Promise<boolean>;
  pendingRemovalId: string | null;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isPending = pendingRemovalId === attendee.id;

  const handleConfirm = async () => {
    const wasSuccessful = await onConfirm(attendee);
    if (wasSuccessful) {
      setIsDialogOpen(false);
    }
  };

  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={(open) => !isPending && setIsDialogOpen(open)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              disabled={isPending}
              className="text-red-500 focus:text-red-500"
            >
              Remove From Event
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to remove?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove the attendee from the event.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
