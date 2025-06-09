"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, FolderSearch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// Defines the shape of a booking object
export interface RoomBooking {
  id: string;
  customer_name: string;
  room_number: string;
  start_at?: string;
}

interface PlaygroundTableProps {
  bookings: RoomBooking[];
  onBookingSelect: (booking: RoomBooking) => void;
  isLoading?: boolean;
}

export default function PlaygroundTable({
  bookings,
  onBookingSelect,
  isLoading = false,
}: PlaygroundTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );

  // Handles sorting logic when column header is clicked
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Memoized sorted version of bookings based on selected column and direction
  const sortedBookings = React.useMemo(() => {
    if (!sortColumn) return bookings;

    return [...bookings].sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortColumn) {
        case "customer":
          valueA = a.customer_name || "";
          valueB = b.customer_name || "";
          break;
        case "room":
          valueA = a.room_number || "";
          valueB = b.room_number || "";
          break;
        case "date":
          valueA = a.start_at ? new Date(a.start_at).getTime() : 0;
          valueB = b.start_at ? new Date(b.start_at).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }
    });
  }, [bookings, sortColumn, sortDirection]);

  // Returns a readable status based on current date and booking time
  const getBookingStatus = (booking: RoomBooking): string => {
    if (!booking.start_at) return "Unknown";

    const now = new Date();
    const bookingDate = new Date(booking.start_at);

    if (bookingDate < now) {
      return "Completed";
    } else if (bookingDate > now) {
      return "Upcoming";
    } else {
      return "In Progress";
    }
  };

  // Returns style classes based on status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-600/20 text-blue-400";
      case "Completed":
        return "bg-green-600/20 text-green-400";
      case "In Progress":
        return "bg-yellow-600/20 text-yellow-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border">
      <Table className="border-collapse">
        <TableHeader className="bg-muted/100 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-b">
            {/* Sortable Customer column */}
            <TableHead
              className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b cursor-pointer"
              onClick={() => handleSort("customer")}
            >
              <div className="flex items-center space-x-2">
                Customer
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>

            {/* Sortable Room column */}
            <TableHead
              className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b cursor-pointer"
              onClick={() => handleSort("room")}
            >
              <div className="flex items-center space-x-2">
                Room
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>

            {/* Sortable Date column */}
            <TableHead
              className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center space-x-2">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>

            {/* Status column */}
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
              Status
            </TableHead>

            {/* Actions column */}
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Show loading state
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center py-8 text-muted-foreground"
              >
                Loading bookings...
              </TableCell>
            </TableRow>
          ) : sortedBookings.length > 0 ? (
            // Render sorted bookings
            sortedBookings.map((booking) => {
              const status = getBookingStatus(booking);
              return (
                <TableRow
                  key={booking.id}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                  onClick={() => onBookingSelect(booking)}
                >
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {booking.customer_name || "No customer name"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {booking.room_number || "No room"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {booking.start_at
                      ? format(
                          new Date(booking.start_at),
                          "MMM dd, yyyy h:mm a"
                        )
                      : "No date"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    <span
                      className={`text-xs px-3 py-1 rounded-md ${getStatusStyle(status)}`}
                    >
                      {status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-right">
                    <div
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-accent"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border bg-popover text-popover-foreground"
                        >
                          <DropdownMenuLabel className="px-3 py-2">
                            Booking Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="px-3 py-2 hover:bg-accent cursor-pointer"
                            onClick={() => onBookingSelect(booking)}
                          >
                            <span>View Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            // Empty state if no bookings
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center py-8 text-muted-foreground"
              >
                <div className="flex flex-col items-center space-y-2">
                  <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                  <span>No bookings found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
