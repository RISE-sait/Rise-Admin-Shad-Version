"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { StaffRoleEnum } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getBarberAvailability,
  getMyBarberAvailability,
  setBarberAvailabilityBulk,
  setMyBarberAvailabilityBulk,
  type BarberAvailabilityDay,
} from "@/services/barberAvailability";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const;

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "17:00";

type DayAvailabilityState = {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

const formatTimeForInput = (
  value: string | null | undefined,
  fallback: string
) => {
  if (!value) {
    return fallback;
  }

  // API may return times with seconds (e.g., 09:00:00). Ensure HH:MM format for the input.
  const normalized = value.length >= 5 ? value.slice(0, 5) : value;
  return normalized.padStart(5, "0");
};

const createDefaultAvailability = (): DayAvailabilityState[] =>
  DAYS_OF_WEEK.map((day) => ({
    id: undefined,
    day_of_week: day.value,
    start_time: DEFAULT_START_TIME,
    end_time: DEFAULT_END_TIME,
    is_active: false,
  }));

type BarberOption = {
  id: string;
  name: string;
};

interface BarberAvailabilityFormProps {
  onClose: () => void;
  barberId?: string;
  barberName?: string;
  barbers?: BarberOption[];
}

export default function BarberAvailabilityForm({
  onClose,
  barberId,
  barberName,
  barbers = [],
}: BarberAvailabilityFormProps) {
  const { user } = useUser();
  const { toast } = useToast();

  const [availability, setAvailability] = useState<DayAvailabilityState[]>(() =>
    createDefaultAvailability()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetBarberId, setTargetBarberId] = useState<string | undefined>(
    () => {
      if (barberId) {
        return barberId;
      }

      if (user?.Role === StaffRoleEnum.BARBER && user.ID) {
        return user.ID;
      }

      return undefined;
    }
  );
  const [activeBarberName, setActiveBarberName] = useState<string | undefined>(
    () => {
      if (barberName) {
        return barberName;
      }

      if (user?.Role === StaffRoleEnum.BARBER) {
        return user.Name;
      }

      return undefined;
    }
  );

  const isBarber = user?.Role === StaffRoleEnum.BARBER;
  const isAdmin =
    user?.Role === StaffRoleEnum.ADMIN ||
    user?.Role === StaffRoleEnum.SUPERADMIN;
  const canSelectBarber = isAdmin;
  const canManageAvailability = Boolean(user?.Jwt && (isBarber || isAdmin));
  const hasBarberOptions = barbers.length > 0;
  const canEditAvailability = Boolean(
    user?.Jwt && isBarber && targetBarberId && user?.ID === targetBarberId
  );

  const hydrateAvailability = useCallback((data?: BarberAvailabilityDay[]) => {
    const base = createDefaultAvailability();

    if (!data || data.length === 0) {
      setAvailability(base);
      return;
    }

    const mapped = base.map((day) => {
      const match = data.find((item) => item.day_of_week === day.day_of_week);
      if (!match) {
        return day;
      }

      return {
        id: match.id,
        day_of_week: day.day_of_week,
        start_time: formatTimeForInput(match.start_time, DEFAULT_START_TIME),
        end_time: formatTimeForInput(match.end_time, DEFAULT_END_TIME),
        is_active: match.is_active ?? true,
      };
    });

    setAvailability(mapped);
  }, []);

  const loadAvailability = useCallback(
    async (barberToLoad: string) => {
      if (!user?.Jwt) {
        setLoading(false);
        setError("You need to be logged in to manage availability.");
        return;
      }

      setLoading(true);
      setError(null);
      setAvailability(createDefaultAvailability());

      const isSelfRequest =
        !canSelectBarber && isBarber && barberToLoad === user?.ID;

      try {
        const data = isSelfRequest
          ? await getMyBarberAvailability(user.Jwt)
          : await getBarberAvailability(barberToLoad, user.Jwt);

        hydrateAvailability(data.availability);

        const resolvedName =
          data.barber_name ||
          barbers.find((option) => option.id === barberToLoad)?.name ||
          (isSelfRequest ? user?.Name : undefined);

        if (resolvedName) {
          setActiveBarberName(resolvedName);
        }
      } catch (err) {
        console.error("Error loading barber availability:", err);
        setError("Failed to load availability. Please try again.");
        toast({ status: "error", description: "Failed to load availability" });
      } finally {
        setLoading(false);
      }
    },
    [
      barbers,
      canSelectBarber,
      hydrateAvailability,
      isBarber,
      toast,
      user?.ID,
      user?.Jwt,
      user?.Name,
    ]
  );

  useEffect(() => {
    if (!canManageAvailability) {
      setLoading(false);
      setError(
        "You must be logged in as a barber or admin to manage availability."
      );
      return;
    }

    if (!targetBarberId) {
      setAvailability(createDefaultAvailability());
      setLoading(false);
      if (canSelectBarber) {
        setError(
          hasBarberOptions
            ? "Select a barber to manage availability."
            : "No barbers available to manage."
        );
      }
      return;
    }

    loadAvailability(targetBarberId);
  }, [
    canManageAvailability,
    canSelectBarber,
    hasBarberOptions,
    loadAvailability,
    targetBarberId,
  ]);

  useEffect(() => {
    if (barberId && barberId !== targetBarberId) {
      setTargetBarberId(barberId);
    }
  }, [barberId, targetBarberId]);

  useEffect(() => {
    if (barberName) {
      setActiveBarberName(barberName);
    }
  }, [barberName]);

  useEffect(() => {
    if (!canSelectBarber && isBarber && user?.ID) {
      setTargetBarberId((current) => (current === user.ID ? current : user.ID));
      setActiveBarberName((current) =>
        current === user.Name ? current : user.Name
      );
    }
  }, [canSelectBarber, isBarber, user?.ID, user?.Name]);

  useEffect(() => {
    if (canSelectBarber && targetBarberId && !activeBarberName) {
      const match = barbers.find((option) => option.id === targetBarberId);
      if (match) {
        setActiveBarberName(match.name);
      }
    }
  }, [activeBarberName, barbers, canSelectBarber, targetBarberId]);

  const handleToggleDay = (dayOfWeek: number, enabled: boolean) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.day_of_week !== dayOfWeek) {
          return day;
        }

        const start_time =
          enabled && day.start_time >= day.end_time
            ? DEFAULT_START_TIME
            : day.start_time;
        const end_time =
          enabled && day.start_time >= day.end_time
            ? DEFAULT_END_TIME
            : day.end_time;

        return {
          ...day,
          is_active: enabled,
          start_time,
          end_time,
        };
      })
    );
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((day) =>
        day.day_of_week === dayOfWeek
          ? {
              ...day,
              [field]: value,
            }
          : day
      )
    );
  };

  const handleRefresh = async () => {
    if (!targetBarberId) {
      if (canSelectBarber) {
        toast({
          status: "info",
          description: "Select a barber to refresh their availability.",
        });
      }
      return;
    }

    await loadAvailability(targetBarberId);
  };

  const handleSave = async () => {
    if (!canManageAvailability) {
      toast({ status: "error", description: "You are not allowed to do that" });
      return;
    }

    if (!user?.Jwt) {
      toast({ status: "error", description: "You must be logged in to save" });
      return;
    }

    if (!targetBarberId) {
      toast({
        status: "error",
        description: "Select a barber before saving availability.",
      });
      return;
    }

    if (!canEditAvailability) {
      toast({
        status: "error",
        description: "Only the assigned barber can update this availability.",
      });
      return;
    }

    const invalidDays = availability.filter(
      (day) => day.is_active && day.start_time >= day.end_time
    );

    if (invalidDays.length > 0) {
      toast({
        status: "error",
        description: "Start time must be before end time for active days.",
      });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        availability: availability.map((day) => ({
          id: day.id,
          day_of_week: day.day_of_week,
          start_time: day.start_time,
          end_time: day.end_time,
          is_active: day.is_active,
        })),
      };

      const isSelfRequest =
        !canSelectBarber && isBarber && targetBarberId === user.ID;

      const data = isSelfRequest
        ? await setMyBarberAvailabilityBulk(payload, user.Jwt)
        : await setBarberAvailabilityBulk(targetBarberId, payload, user.Jwt);

      hydrateAvailability(data.availability);

      if (data.barber_name) {
        setActiveBarberName(data.barber_name);
      }

      toast({ status: "success", description: "Availability updated" });
    } catch (err) {
      console.error("Error saving barber availability:", err);
      toast({ status: "error", description: "Failed to save availability" });
    } finally {
      setSaving(false);
    }
  };

  const activeDayCount = useMemo(
    () => availability.filter((day) => day.is_active).length,
    [availability]
  );

  const availabilityDescription = canSelectBarber
    ? "Select a barber to review their availability. Only barbers can update their own schedules."
    : "Set the days and times when you are available for haircut appointments.";

  const activeDaySummary = loading
    ? "Loading availability..."
    : targetBarberId
      ? `${activeDayCount} day${activeDayCount === 1 ? "" : "s"} active`
      : "Select a barber to load availability.";

  const disableDayControls =
    !targetBarberId || loading || saving || !canEditAvailability;
  const disableTimeInputs =
    !targetBarberId || loading || saving || !canEditAvailability;
  const refreshDisabled = loading || saving || !targetBarberId;
  const saveDisabled =
    saving || loading || !targetBarberId || !canEditAvailability;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Weekly availability</h3>
        <p className="text-sm text-muted-foreground">
          {availabilityDescription}
        </p>
      </div>

      {!canManageAvailability && (
        <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
          {error ??
            "You must be logged in as a barber or admin to manage availability."}
        </div>
      )}

      {canManageAvailability && (
        <div className="space-y-4">
          {canSelectBarber && (
            <div className="space-y-2">
              <Label htmlFor="barber-select">Barber</Label>
              <Select
                value={targetBarberId ?? undefined}
                onValueChange={(value) => {
                  setTargetBarberId(value);
                  const match = barbers.find((option) => option.id === value);
                  setActiveBarberName(match?.name);
                }}
                disabled={!hasBarberOptions || loading || saving}
              >
                <SelectTrigger id="barber-select">
                  <SelectValue
                    placeholder={
                      hasBarberOptions
                        ? "Select a barber"
                        : "No barbers available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {barbers.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!hasBarberOptions && (
                <p className="text-sm text-muted-foreground">
                  Add barbers to manage their availability.
                </p>
              )}
            </div>
          )}

          {activeBarberName && targetBarberId && (
            <div className="rounded-md border border-muted/40 bg-muted/10 p-3 text-sm text-muted-foreground">
              Managing availability for
              <span className="ml-1 font-medium text-foreground">
                {activeBarberName}
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!canEditAvailability &&
            canManageAvailability &&
            isAdmin &&
            targetBarberId && (
              <div className="rounded-md border border-muted/40 bg-muted/10 p-3 text-sm text-muted-foreground">
                Availability is read-only for admins. Ask the barber to update
                their schedule if changes are needed.
              </div>
            )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {activeDaySummary}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshDisabled}
            >
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {availability.map((day) => (
              <div key={day.day_of_week} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-base font-semibold">
                      {
                        DAYS_OF_WEEK.find((d) => d.value === day.day_of_week)
                          ?.label
                      }
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {day.is_active ? "Accepting bookings" : "Unavailable"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`day-${day.day_of_week}`}
                      checked={day.is_active}
                      onCheckedChange={(checked) =>
                        handleToggleDay(day.day_of_week, checked)
                      }
                      disabled={disableDayControls}
                    />
                    <Label
                      htmlFor={`day-${day.day_of_week}`}
                      className="text-sm"
                    >
                      {day.is_active ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`start-${day.day_of_week}`}>
                      Start time
                    </Label>
                    <Input
                      id={`start-${day.day_of_week}`}
                      type="time"
                      value={day.start_time}
                      onChange={(event) =>
                        handleTimeChange(
                          day.day_of_week,
                          "start_time",
                          event.target.value
                        )
                      }
                      disabled={!day.is_active || disableTimeInputs}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`end-${day.day_of_week}`}>End time</Label>
                    <Input
                      id={`end-${day.day_of_week}`}
                      type="time"
                      value={day.end_time}
                      onChange={(event) =>
                        handleTimeChange(
                          day.day_of_week,
                          "end_time",
                          event.target.value
                        )
                      }
                      disabled={!day.is_active || disableTimeInputs}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            {canEditAvailability ? (
              <Button onClick={handleSave} disabled={saveDisabled}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground sm:text-right">
                Only the selected barber can update their availability.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
