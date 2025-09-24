"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import RightDrawer from "@/components/reusable/RightDrawer";
import AvailabilityForm, {
  AvailabilityFormValues,
  dayOptions,
  normalizeDayOfWeek,
} from "./AvailabilityForm";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import {
  BarberAvailabilityRecord,
  createBarberAvailability,
  deleteBarberAvailability,
  getMyBarberAvailability,
  updateBarberAvailability,
} from "@/services/barberAvailability";
import { formatDate } from "@/lib/utils";

function formatDisplayTime(time?: string) {
  if (!time) return "--";
  const parts = time.split(":");
  const hour = Number(parts[0]);
  const minute = Number(parts[1] ?? "0");

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return time;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const getComparableDayValue = (day: number) => {
  const normalized = normalizeDayOfWeek(day);
  return typeof normalized === "number" ? normalized : day;
};

export default function ManageBarberAvailability() {
  const { toast } = useToast();
  const { user } = useUser();

  const [availability, setAvailability] = useState<BarberAvailabilityRecord[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedAvailability, setSelectedAvailability] =
    useState<BarberAvailabilityRecord | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const refreshAvailability = useCallback(async () => {
    if (!user?.Jwt) {
      setAvailability([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getMyBarberAvailability(user.Jwt);
      setAvailability(response.availability ?? []);
    } catch (error) {
      console.error("Error loading barber availability:", error);
      toast({ status: "error", description: "Failed to load availability" });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user?.Jwt]);

  useEffect(() => {
    refreshAvailability();
  }, [refreshAvailability]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerMode(null);
    setSelectedAvailability(null);
    setDeleteSubmitting(false);
  };

  const handleFormSubmit = async (values: AvailabilityFormValues) => {
    if (!user?.Jwt) {
      toast({ status: "error", description: "You must be logged in" });
      return;
    }

    if (drawerMode === "create" && typeof values.day_of_week !== "number") {
      toast({ status: "error", description: "Please select a day" });
      return;
    }

    setFormSubmitting(true);

    try {
      if (drawerMode === "create") {
        await createBarberAvailability(
          {
            day_of_week:
              typeof values.day_of_week === "number" ? values.day_of_week : 0,
            start_time: values.start_time,
            end_time: values.end_time,
            is_active: values.is_active,
          },
          user.Jwt
        );

        toast({
          status: "success",
          description: "Availability saved",
        });
      } else if (drawerMode === "edit" && selectedAvailability) {
        await updateBarberAvailability(
          selectedAvailability.id,
          {
            start_time: values.start_time,
            end_time: values.end_time,
            is_active: values.is_active,
          },
          user.Jwt
        );

        toast({
          status: "success",
          description: "Availability updated",
        });
      }

      handleDrawerClose();
      await refreshAvailability();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save availability",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!user?.Jwt) {
      toast({ status: "error", description: "You must be logged in" });
      return;
    }

    if (!selectedAvailability?.id) {
      toast({ status: "error", description: "No availability selected" });
      return;
    }

    setDeleteSubmitting(true);
    try {
      await deleteBarberAvailability(selectedAvailability.id, user.Jwt);
      toast({ status: "success", description: "Availability removed" });

      handleDrawerClose();
      await refreshAvailability();
    } catch (error) {
      console.error("Error deleting availability:", error);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete availability",
      });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const sortedAvailability = useMemo(() => {
    return [...availability].sort((a, b) => {
      const aDay = getComparableDayValue(a.day_of_week);
      const bDay = getComparableDayValue(b.day_of_week);

      if (aDay === bDay) {
        return a.start_time.localeCompare(b.start_time);
      }
      return aDay - bDay;
    });
  }, [availability]);

  const unavailableDays = useMemo(() => {
    return Array.from(
      new Set(
        availability.map((item) => getComparableDayValue(item.day_of_week))
      )
    );
  }, [availability]);

  const isAuthenticated = Boolean(user?.Jwt);

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="My Availability"
          description="Manage your weekly schedule"
        />
        <Button
          onClick={() => {
            setDrawerMode("create");
            setSelectedAvailability(null);
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={!isAuthenticated}
        >
          <PlusIcon className="h-4 w-4" />
          Add availability
        </Button>
      </div>

      <Separator />

      <Button variant="outline" className="mb-4" asChild>
        <Link href="/manage/barbershop">← Back to Barbershop</Link>
      </Button>

      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/100">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Day
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Hours
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Updated
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isAuthenticated ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 px-6 py-8 text-center text-muted-foreground"
                >
                  Sign in as a barber to manage availability.
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 px-6 py-8 text-center text-muted-foreground"
                >
                  Loading availability…
                </TableCell>
              </TableRow>
            ) : sortedAvailability.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 px-6 py-8 text-center text-muted-foreground"
                >
                  No availability configured yet.
                </TableCell>
              </TableRow>
            ) : (
              sortedAvailability.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setDrawerMode("edit");
                    setSelectedAvailability(item);
                    setDrawerOpen(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setDrawerMode("edit");
                      setSelectedAvailability(item);
                      setDrawerOpen(true);
                    }
                  }}
                >
                  <TableCell className="px-6 py-4 text-sm font-semibold">
                    {dayOptions.find(
                      (day) =>
                        day.value === getComparableDayValue(item.day_of_week)
                    )?.label ||
                      `Day ${getComparableDayValue(item.day_of_week)}`}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {formatDisplayTime(item.start_time)} –{" "}
                    {formatDisplayTime(item.end_time)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    <Badge variant={item.is_active ? "secondary" : "outline"}>
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(item.updated_at || item.created_at || "") ||
                      "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        drawerWidth="w-[420px]"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerMode === "edit" ? "Edit availability" : "Add availability"}
          </h2>
          <AvailabilityForm
            mode={drawerMode === "edit" ? "edit" : "create"}
            onSubmit={handleFormSubmit}
            onCancel={handleDrawerClose}
            initialData={drawerMode === "edit" ? selectedAvailability : null}
            isSubmitting={formSubmitting}
            unavailableDays={drawerMode === "edit" ? [] : unavailableDays}
            onDelete={drawerMode === "edit" ? handleDeleteSelected : undefined}
            isDeleting={deleteSubmitting}
          />
        </div>
      </RightDrawer>
    </div>
  );
}
