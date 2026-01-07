"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Send,
  Mail,
  Bell,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { EnrolledCustomer, NotificationChannel, SendNotificationResponse, NotificationHistoryItem } from "@/types/events";
import { sendEventNotification, getEnrolledCustomers, getNotificationHistory } from "@/services/events";
import { StaffRoleEnum } from "@/types/user";
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
  data: EnrolledCustomer[];
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

  // Notification state
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationChannel, setNotificationChannel] = useState<NotificationChannel>("both");
  const [notificationSubject, setNotificationSubject] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [includeEventDetails, setIncludeEventDetails] = useState(true);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notificationResult, setNotificationResult] = useState<SendNotificationResponse | null>(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [enrolledStats, setEnrolledStats] = useState<{ withEmail: number; withPush: number } | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const canSendNotifications = user?.Role && ![StaffRoleEnum.RECEPTIONIST].includes(user.Role);

  // Fetch notification history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.Jwt) return;

      setIsLoadingHistory(true);
      try {
        const response = await getNotificationHistory(eventId, user.Jwt);
        setNotificationHistory(response.notifications || []);
      } catch {
        setNotificationHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [eventId, user?.Jwt]);

  const handleOpenNotificationDialog = async () => {
    if (!user?.Jwt) return;

    try {
      const enrolled = await getEnrolledCustomers(eventId, user.Jwt);
      const withEmail = enrolled.customers.filter(c => c.email).length;
      const withPush = enrolled.customers.filter(c => c.has_push_token).length;
      setEnrolledStats({ withEmail, withPush });
    } catch (error) {
      console.error("Failed to fetch enrolled stats:", error);
      setEnrolledStats({ withEmail: data.length, withPush: 0 });
    }

    setNotificationDialogOpen(true);
  };

  const handleSendNotification = async () => {
    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be signed in to send notifications.",
        variant: "destructive",
      });
      return;
    }

    if (!notificationMessage.trim()) {
      toast({
        status: "error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    if ((notificationChannel === "email" || notificationChannel === "both") && !notificationSubject.trim()) {
      toast({
        status: "error",
        description: "Please enter a subject for the email.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingNotification(true);

    try {
      const result = await sendEventNotification(
        eventId,
        {
          channel: notificationChannel,
          subject: notificationSubject,
          message: notificationMessage,
          include_event_details: includeEventDetails,
          customer_ids: null,
        },
        user.Jwt
      );

      setNotificationResult(result);
      setNotificationDialogOpen(false);
      setResultDialogOpen(true);

      // Refetch notification history
      try {
        const response = await getNotificationHistory(eventId, user.Jwt);
        setNotificationHistory(response.notifications || []);
      } catch {
        // Silently fail
      }

      // Reset form
      setNotificationSubject("");
      setNotificationMessage("");
      setNotificationChannel("both");
      setIncludeEventDetails(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send notification.";
      toast({
        status: "error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleCloseNotificationDialog = () => {
    if (!isSendingNotification) {
      setNotificationDialogOpen(false);
    }
  };

  const handleRemoveAttendee = useCallback(
    async (attendee: EnrolledCustomer) => {
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

  const columns = useMemo<ColumnDef<EnrolledCustomer>[]>(
    () => [
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
          <div className="text-sm text-muted-foreground break-all">
            {row.original.email}
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
    <>
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

        {/* Send Notification Section */}
        {canSendNotifications && data.length > 0 && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleOpenNotificationDialog}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification to Attendees
            </Button>
          </div>
        )}

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

      {/* Send Notification Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={handleCloseNotificationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Notification
            </DialogTitle>
            <DialogDescription>
              Send a notification to all {data.length} enrolled customers.
              {enrolledStats && (
                <span className="block mt-1 text-xs">
                  ({enrolledStats.withEmail} with email, {enrolledStats.withPush} with push enabled)
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Channel Selection */}
            <div className="space-y-2">
              <Label htmlFor="channel">Notification Type</Label>
              <Select
                value={notificationChannel}
                onValueChange={(value) => setNotificationChannel(value as NotificationChannel)}
              >
                <SelectTrigger id="channel">
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Only
                    </div>
                  </SelectItem>
                  <SelectItem value="push">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Push Notification Only
                    </div>
                  </SelectItem>
                  <SelectItem value="both">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Both Email & Push
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject (for email) */}
            {(notificationChannel === "email" || notificationChannel === "both") && (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject..."
                  value={notificationSubject}
                  onChange={(e) => setNotificationSubject(e.target.value)}
                />
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
              />
            </div>

            {/* Include Event Details */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDetails"
                checked={includeEventDetails}
                onCheckedChange={(checked) => setIncludeEventDetails(checked === true)}
              />
              <Label htmlFor="includeDetails" className="text-sm font-normal cursor-pointer">
                Include event details (name, date, location)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseNotificationDialog}
              disabled={isSendingNotification}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              disabled={isSendingNotification}
            >
              {isSendingNotification ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Notification Sent!
            </DialogTitle>
          </DialogHeader>

          {notificationResult && (
            <div className="space-y-4 py-4">
              <div className="text-sm">
                <span className="font-medium">Recipients:</span> {notificationResult.recipient_count}
              </div>

              {(notificationChannel === "email" || notificationChannel === "both") && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {notificationResult.email_sent} sent
                    </span>
                    {notificationResult.email_failed > 0 && (
                      <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="h-4 w-4" />
                        {notificationResult.email_failed} failed
                      </span>
                    )}
                  </div>
                </div>
              )}

              {(notificationChannel === "push" || notificationChannel === "both") && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-medium">Push</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {notificationResult.push_sent} sent
                    </span>
                    {notificationResult.push_failed > 0 && (
                      <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="h-4 w-4" />
                        {notificationResult.push_failed} failed
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setResultDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification History Card */}
      {notificationHistory.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500 mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">Notification History</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Past notifications sent to attendees.
            </p>

            <div className="space-y-3">
              {notificationHistory.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {notification.channel === "email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                      {notification.channel === "push" && <Bell className="h-4 w-4 text-muted-foreground" />}
                      {notification.channel === "both" && <Send className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm font-medium">
                        {notification.channel === "email" ? "Email" : notification.channel === "push" ? "Push" : "Email & Push"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {notification.subject && (
                    <p className="text-sm font-medium mb-1">{notification.subject}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Sent by: {notification.sent_by_name}</span>
                    <span>Recipients: {notification.recipient_count}</span>
                    {(notification.channel === "email" || notification.channel === "both") && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {notification.email_success_count} sent
                        {notification.email_failure_count > 0 && (
                          <span className="text-red-500">, {notification.email_failure_count} failed</span>
                        )}
                      </span>
                    )}
                    {(notification.channel === "push" || notification.channel === "both") && (
                      <span className="flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        {notification.push_success_count} sent
                        {notification.push_failure_count > 0 && (
                          <span className="text-red-500">, {notification.push_failure_count} failed</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoadingHistory && (
        <Card className="border-l-4 border-l-yellow-500 mt-4">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Loading notification history...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function AttendeeActions({
  attendee,
  onConfirm,
  pendingRemovalId,
}: {
  attendee: EnrolledCustomer;
  onConfirm: (attendee: EnrolledCustomer) => Promise<boolean>;
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
