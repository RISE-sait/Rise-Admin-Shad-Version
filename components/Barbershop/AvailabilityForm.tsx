"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BarberAvailabilityRecord } from "@/services/barberAvailability";

type AvailabilityFormMode = "create" | "edit";

export type AvailabilityFormValues = {
  day_of_week?: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

const dayOptions = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

interface AvailabilityFormProps {
  mode: AvailabilityFormMode;
  onSubmit: (values: AvailabilityFormValues) => Promise<void> | void;
  onCancel: () => void;
  initialData?: BarberAvailabilityRecord | null;
  isSubmitting?: boolean;
  unavailableDays?: number[];
  onDelete?: () => Promise<void> | void;
  isDeleting?: boolean;
}

function normalizeTimeValue(value?: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":");
  if (!hours) return value;
  return `${hours.padStart(2, "0")}:${(minutes ?? "00").padStart(2, "0")}`;
}

function normalizeDayOfWeek(value?: number) {
  if (typeof value !== "number") {
    return undefined;
  }

  return value === 0 ? 7 : value;
}

export default function AvailabilityForm({
  mode,
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  unavailableDays = [],
  onDelete,
  isDeleting = false,
}: AvailabilityFormProps) {
  const { toast } = useToast();
  const normalizedInitialDay = normalizeDayOfWeek(initialData?.day_of_week);
  const normalizedUnavailableDays = useMemo(
    () =>
      unavailableDays
        .map(normalizeDayOfWeek)
        .filter((value): value is number => typeof value === "number"),
    [unavailableDays]
  );
  const [formValues, setFormValues] = useState<AvailabilityFormValues>({
    day_of_week: mode === "create" ? undefined : normalizedInitialDay,
    start_time: normalizeTimeValue(initialData?.start_time),
    end_time: normalizeTimeValue(initialData?.end_time),
    is_active: initialData?.is_active ?? true,
  });

  useEffect(() => {
    setFormValues({
      day_of_week:
        mode === "create"
          ? undefined
          : normalizeDayOfWeek(initialData?.day_of_week),
      start_time: normalizeTimeValue(initialData?.start_time),
      end_time: normalizeTimeValue(initialData?.end_time),
      is_active: initialData?.is_active ?? true,
    });
  }, [initialData, mode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "create" && typeof formValues.day_of_week !== "number") {
      toast({
        status: "error",
        description: "Please select a day of the week",
      });
      return;
    }

    if (!formValues.start_time || !formValues.end_time) {
      toast({
        status: "error",
        description: "Start and end times are required",
      });
      return;
    }

    if (formValues.start_time >= formValues.end_time) {
      toast({
        status: "error",
        description: "Start time must be before end time",
      });
      return;
    }

    await onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-3">
      {mode === "create" ? (
        <div className="space-y-2">
          <Label>Day of week</Label>
          <Select
            value={
              typeof formValues.day_of_week === "number"
                ? formValues.day_of_week.toString()
                : undefined
            }
            onValueChange={(value) =>
              setFormValues((previous) => ({
                ...previous,
                day_of_week: Number(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((day) => (
                <SelectItem
                  key={day.value}
                  value={day.value.toString()}
                  disabled={normalizedUnavailableDays.includes(day.value)}
                >
                  {day.label}
                  {normalizedUnavailableDays.includes(day.value) &&
                    " (Already set)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Availability is stored with Monday as 1 through Sunday as 7.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Day of week</Label>
          <Input
            value={
              dayOptions.find(
                (day) =>
                  day.value === normalizeDayOfWeek(initialData?.day_of_week)
              )?.label || ""
            }
            disabled
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Start time</Label>
        <Input
          type="time"
          value={formValues.start_time}
          onChange={(event) =>
            setFormValues((previous) => ({
              ...previous,
              start_time: event.target.value,
            }))
          }
          step={300}
        />
      </div>

      <div className="space-y-2">
        <Label>End time</Label>
        <Input
          type="time"
          value={formValues.end_time}
          onChange={(event) =>
            setFormValues((previous) => ({
              ...previous,
              end_time: event.target.value,
            }))
          }
          step={300}
        />
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Active</p>
          <p className="text-xs text-muted-foreground">
            Toggle availability on or off without deleting it
          </p>
        </div>
        <Switch
          checked={formValues.is_active}
          onCheckedChange={(checked) =>
            setFormValues((previous) => ({
              ...previous,
              is_active: checked,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-3 pt-4">
        {mode === "edit" && onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete availability"}
          </Button>
        )}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isDeleting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting
              ? mode === "create"
                ? "Saving…"
                : "Updating…"
              : mode === "create"
                ? "Save availability"
                : "Update availability"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export { dayOptions, normalizeDayOfWeek };
