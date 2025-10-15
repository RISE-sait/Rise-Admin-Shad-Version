"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, UserPlus, Search } from "lucide-react";
import { revalidateEvents } from "@/actions/serverActions";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getAllStaffs } from "@/services/staff";
import {
  assignStaffToEvent,
  getEvent,
  unassignStaffFromEvent,
} from "@/services/events";
import { CalendarEvent } from "@/types/calendar";
import { EventStaffMember as EventStaffDto } from "@/types/events";
import { User } from "@/types/user";

type CalendarStaffMember = CalendarEvent["staff"][number];

interface EventStaffTabProps {
  event: CalendarEvent;
  onStaffChange?: (staff: CalendarEvent["staff"]) => void;
}

function mapUserToEventStaff(user: User): CalendarStaffMember {
  const [firstName, ...rest] = (user.Name || "").trim().split(/\s+/);
  const lastName = rest.join(" ");

  return {
    id: user.ID,
    email: user.Email ?? "",
    firstName: firstName || "",
    lastName: lastName || "",
    phone: user.Phone ?? "",
    gender: "",
    roleName: user.StaffInfo?.Role ?? "",
  };
}

function mapEventStaffToCalendarStaff(
  staff: EventStaffDto
): CalendarStaffMember {
  return {
    id: staff.id,
    email: staff.email ?? "",
    firstName: staff.first_name,
    lastName: staff.last_name,
    phone: staff.phone ?? "",
    gender: staff.gender ?? "",
    roleName: staff.role_name ?? "",
  };
}

function getFullName(staff: CalendarStaffMember): string {
  return [staff.firstName, staff.lastName].filter(Boolean).join(" ").trim();
}

function formatRole(role: string): string {
  if (!role) return "Staff";
  return role
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function sortStaffByName(staff: CalendarStaffMember[]): CalendarStaffMember[] {
  return [...staff].sort((a, b) =>
    getFullName(a).localeCompare(getFullName(b), undefined, {
      sensitivity: "base",
    })
  );
}

function areStaffListsEqual(
  first: CalendarStaffMember[],
  second: CalendarStaffMember[]
): boolean {
  if (first.length !== second.length) {
    return false;
  }

  const sortById = (list: CalendarStaffMember[]) =>
    [...list].sort((staffA, staffB) => staffA.id.localeCompare(staffB.id));

  const sortedFirst = sortById(first);
  const sortedSecond = sortById(second);

  return sortedFirst.every((staffMember, index) => {
    const comparisonTarget = sortedSecond[index];
    return (
      staffMember.id === comparisonTarget.id &&
      staffMember.email === comparisonTarget.email &&
      staffMember.firstName === comparisonTarget.firstName &&
      staffMember.lastName === comparisonTarget.lastName &&
      staffMember.phone === comparisonTarget.phone &&
      staffMember.gender === comparisonTarget.gender &&
      staffMember.roleName === comparisonTarget.roleName
    );
  });
}

export default function EventStaffTab({
  event,
  onStaffChange,
}: EventStaffTabProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [assignedStaff, setAssignedStaff] = useState<CalendarEvent["staff"]>(
    event.staff ?? []
  );
  const [availableStaff, setAvailableStaff] = useState<CalendarEvent["staff"]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingStaffId, setPendingStaffId] = useState<string | null>(null);

  const skipNextFetchRef = useRef(false);

  const refreshEventStaff = useCallback(
    async (options?: { showErrorToast?: boolean }) => {
      if (!user?.Jwt) {
        return;
      }

      try {
        const eventDetails = await getEvent(event.id, user.Jwt);
        const fetchedStaff =
          eventDetails.staff?.map(mapEventStaffToCalendarStaff) ?? [];
        const normalizedStaff = sortStaffByName(fetchedStaff);

        let didUpdate = false;
        setAssignedStaff((currentStaff) => {
          if (areStaffListsEqual(currentStaff, normalizedStaff)) {
            return currentStaff;
          }
          didUpdate = true;
          return normalizedStaff;
        });

        if (didUpdate) {
          onStaffChange?.(normalizedStaff);
        }
      } catch (error) {
        console.error("Failed to fetch event staff:", error);
        if (options?.showErrorToast) {
          toast({
            status: "error",
            description: "Unable to refresh event staff.",
            variant: "destructive",
          });
        }
      }
    },
    [event.id, onStaffChange, toast, user?.Jwt]
  );

  useEffect(() => {
    setAssignedStaff(event.staff ?? []);
  }, [event]);

  useEffect(() => {
    void refreshEventStaff();
  }, [refreshEventStaff]);

  useEffect(() => {
    setSearchTerm("");
  }, [event.id]);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    let isMounted = true;

    const loadAvailableStaff = async () => {
      setIsLoading(true);
      try {
        const staffList = await getAllStaffs();
        if (!isMounted) return;

        const assignedIds = new Set(assignedStaff.map((staff) => staff.id));

        const mappedStaff = staffList
          .filter((staff) => !assignedIds.has(staff.ID))
          .map(mapUserToEventStaff);

        setAvailableStaff(sortStaffByName(mappedStaff));
      } catch (error) {
        if (isMounted) {
          toast({
            status: "error",
            description: "Unable to load available staff.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAvailableStaff();

    return () => {
      isMounted = false;
    };
  }, [event.id, assignedStaff, toast]);

  const filteredAvailableStaff = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) {
      return availableStaff;
    }

    return availableStaff.filter((staff) => {
      const name = getFullName(staff).toLowerCase();
      return (
        name.includes(normalizedQuery) ||
        staff.email.toLowerCase().includes(normalizedQuery) ||
        staff.roleName.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [availableStaff, searchTerm]);

  const handleAssign = async (staffMember: CalendarStaffMember) => {
    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be signed in to modify staff.",
        variant: "destructive",
      });
      return;
    }

    skipNextFetchRef.current = true;

    const previousAssigned = assignedStaff;
    const previousAvailable = availableStaff;
    const updatedAssigned = [...assignedStaff, staffMember];
    const updatedAvailable = availableStaff.filter(
      (staff) => staff.id !== staffMember.id
    );

    setAssignedStaff(updatedAssigned);
    setAvailableStaff(updatedAvailable);
    setPendingStaffId(staffMember.id);

    try {
      await assignStaffToEvent(event.id, staffMember.id, user.Jwt);
      try {
        await revalidateEvents();
      } catch (revalidateError) {
        console.error(
          "Failed to revalidate events after assigning staff:",
          revalidateError
        );
      }
      onStaffChange?.(updatedAssigned);
      void refreshEventStaff({ showErrorToast: true });
    } catch (error) {
      setAssignedStaff(previousAssigned);
      setAvailableStaff(previousAvailable);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign staff member to the event.",
        variant: "destructive",
      });
    } finally {
      setPendingStaffId(null);
    }
  };

  const handleUnassign = async (staffMember: CalendarStaffMember) => {
    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be signed in to modify staff.",
        variant: "destructive",
      });
      return;
    }

    skipNextFetchRef.current = true;

    const previousAssigned = assignedStaff;
    const previousAvailable = availableStaff;
    const updatedAssigned = assignedStaff.filter(
      (staff) => staff.id !== staffMember.id
    );
    const updatedAvailable = sortStaffByName([...availableStaff, staffMember]);

    setAssignedStaff(updatedAssigned);
    setAvailableStaff(updatedAvailable);
    setPendingStaffId(staffMember.id);

    try {
      await unassignStaffFromEvent(event.id, staffMember.id, user.Jwt);
      try {
        await revalidateEvents();
      } catch (revalidateError) {
        console.error(
          "Failed to revalidate events after unassigning staff:",
          revalidateError
        );
      }
      onStaffChange?.(updatedAssigned);
      void refreshEventStaff({ showErrorToast: true });
    } catch (error) {
      setAssignedStaff(previousAssigned);
      setAvailableStaff(previousAvailable);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to remove staff member from the event.",
        variant: "destructive",
      });
    } finally {
      setPendingStaffId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Assigned Staff Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Assigned Staff</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Manage the staff members assigned to this event.
          </p>
          {assignedStaff.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground bg-muted/30 rounded-lg">
              No staff members are currently assigned.
            </div>
          ) : (
            <ul className="space-y-2">
              {assignedStaff.map((staff) => {
                const displayName = getFullName(staff) || staff.email || "Staff";
                return (
                  <li
                    key={staff.id}
                    className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRole(staff.roleName)}
                        {staff.email ? ` • ${staff.email}` : ""}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void handleUnassign(staff)}
                      disabled={pendingStaffId === staff.id}
                    >
                      Remove
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Available Staff Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Available Staff</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Search for staff members to add to this event.
          </p>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, role, or email"
              className="pl-9 bg-background"
            />
          </div>
          <ScrollArea className="h-64 rounded-lg border bg-muted/20">
            <div className="p-3 space-y-2">
              {isLoading ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Loading staff…
                </div>
              ) : filteredAvailableStaff.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {searchTerm
                    ? "No staff members match your search."
                    : "No additional staff members available."}
                </div>
              ) : (
                filteredAvailableStaff.map((staff) => {
                  const displayName =
                    getFullName(staff) || staff.email || "Staff";
                  return (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between rounded-lg bg-background border px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRole(staff.roleName)}
                          {staff.email ? ` • ${staff.email}` : ""}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                        onClick={() => void handleAssign(staff)}
                        disabled={pendingStaffId === staff.id}
                      >
                        Add
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
