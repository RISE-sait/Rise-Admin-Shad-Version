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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { HaircutEventEventResponseDto } from "@/app/api/Api";
import { format } from "date-fns";
import { fromZonedISOString } from "@/lib/utils";

interface BarberTableProps {
  appointments: HaircutEventEventResponseDto[];
  onAppointmentSelect: (appointment: HaircutEventEventResponseDto) => void;
  onDeleteAppointment?: (appointmentId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function BarberTable({
  appointments,
  onAppointmentSelect,
  onDeleteAppointment,
  isLoading = false,
}: BarberTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedAppointments = React.useMemo(() => {
    if (!sortColumn) return appointments;

    return [...appointments].sort((a, b) => {
      let valueA, valueB;

      switch (sortColumn) {
        case "customer":
          valueA = a.customer_name || "";
          valueB = b.customer_name || "";
          break;
        case "barber":
          valueA = a.barber_name || "";
          valueB = b.barber_name || "";
          break;
        case "date":
          valueA = a.start_at ? fromZonedISOString(a.start_at).getTime() : 0;
          valueB = b.start_at ? fromZonedISOString(b.start_at).getTime() : 0;
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
  }, [appointments, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(startIndex, endIndex);

  // Reset to page 1 when appointments change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [appointments]);

  // Function to determine appointment status
  const getAppointmentStatus = (
    appointment: HaircutEventEventResponseDto
  ): string => {
    if (!appointment.start_at) return "Unknown";

    const now = new Date();
    const appointmentDate = fromZonedISOString(appointment.start_at);

    if (appointmentDate < now) {
      return "Completed";
    } else if (appointmentDate > now) {
      return "Upcoming";
    } else {
      return "In Progress";
    }
  };

  // Get status style based on appointment status
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
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/100 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead
                className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b cursor-pointer"
                onClick={() => handleSort("customer")}
              >
                <div className="flex items-center space-x-2">
                  Customer
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b cursor-pointer"
                onClick={() => handleSort("barber")}
              >
                <div className="flex items-center space-x-2">
                  Barber
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center space-x-2">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center py-8 text-muted-foreground"
                >
                  Loading appointments...
                </TableCell>
              </TableRow>
            ) : paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((appointment) => {
              const status = getAppointmentStatus(appointment);
              return (
                <TableRow
                  key={appointment.id}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                  onClick={() => onAppointmentSelect(appointment)}
                >
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {appointment.customer_name || "No customer name"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {appointment.barber_name || "No barber assigned"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {appointment.start_at
                      ? format(
                          fromZonedISOString(appointment.start_at),
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
                            Appointment Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="px-3 py-2 hover:bg-accent cursor-pointer"
                            onClick={() => onAppointmentSelect(appointment)}
                          >
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {onDeleteAppointment && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="px-3 py-2 hover:bg-destructive/10 cursor-pointer text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <span>Cancel Appointment</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirm Cancellation
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this
                                    appointment?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Keep Appointment
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      appointment.id &&
                                      onDeleteAppointment(appointment.id)
                                    }
                                  >
                                    Confirm Cancel
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center py-8 text-muted-foreground"
              >
                <div className="flex flex-col items-center space-y-2">
                  <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                  <span>No appointments found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {/* Pagination Controls */}
    {!isLoading && sortedAppointments.length > 0 && (
      <div className="flex items-center justify-between px-4 py-3 border rounded-xl">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedAppointments.length)} of {sortedAppointments.length} appointments
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and pages around current
                return (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : ""}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    )}
  </div>
  );
}
