"use";

import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  createEvents,
  deleteEventsByRecurrenceID,
  updateRecurrence,
} from "@/services/events";
import { EventSchedule } from "@/types/events";
import { Team } from "@/types/team";
import { Location } from "@/types/location";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getAllLocations } from "@/services/location";
import { Card } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { getAllTeams } from "@/services/teams";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TrashIcon, SaveIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/dates";

export default function ScheduleCard({
  onDeleteSchedule,
  refreshSchedules,
  schedule,
  isAddCard = false,
}: {
  onDeleteSchedule: (id: string) => void;
  refreshSchedules: () => void;
  schedule: EventSchedule;
  isAddCard?: boolean;
}) {
  const { toast } = useToast();

  const { user } = useUser();
  const jwt = user?.Jwt;

  const form = useForm({
    defaultValues: {
      recurrence_start_at: formatEventDate(schedule.recurrence_start_at).slice(
        0,
        16
      ) as string,
      recurrence_end_at: formatEventDate(schedule.recurrence_end_at).slice(
        0,
        16
      ) as string,
      event_start_at: schedule.event_start_at as string,
      event_end_at: schedule.event_end_at as string,
      day: schedule.day.toUpperCase() as string,
      location_name: schedule.location?.name as string,
      team_name: schedule.team?.name as string,
    },
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  async function handleDeleteSchedule(event: React.MouseEvent) {
    try {
      event.preventDefault();
      await deleteEventsByRecurrenceID(schedule.id, jwt!);
      onDeleteSchedule(schedule.id);
      toast({
        description: "Schedule deleted successfully",
        status: "success",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete schedule", error);
      toast({
        description:
          error instanceof Error ? error.message : "Failed to delete schedule",
        status: "error",
        variant: "destructive",
      });
    }
  }

  async function handleCreateSchedule(event: React.MouseEvent) {
    try {
      event.preventDefault();

      const location = locations.find(
        (loc) => loc.name === form.getValues("location_name")
      );
      const team = teams.find(
        (team) => team.name === form.getValues("team_name")
      );

      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        const base = new Date();
        base.setHours(Number(hours), Number(minutes), 0, 0);
        return formatEventDate(base).split("T")[1];
      };

      await createEvents(
        {
          program_id: schedule.program?.id,
          location_id: location?.id,
          team_id: team?.id,
          recurrence_start_at: formatEventDate(
            new Date(form.getValues("recurrence_start_at"))
          ),
          recurrence_end_at: formatEventDate(
            new Date(form.getValues("recurrence_end_at"))
          ),
          event_start_at: formatTime(form.getValues("event_start_at")),
          event_end_at: formatTime(form.getValues("event_end_at")),
          day: form.getValues("day"),
        },
        jwt!
      );

      refreshSchedules();

      toast({
        description: "Schedule created successfully",
        status: "success",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to create schedule", error);
      toast({
        description:
          error instanceof Error ? error.message : "Failed to create schedule",
        status: "error",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateSchedule(event: React.MouseEvent) {
    try {
      event.preventDefault();

      const location = locations.find(
        (loc) => loc.name === form.getValues("location_name")
      );
      const team = teams.find(
        (team) => team.name === form.getValues("team_name")
      );

      // should be mdt timezone
      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        const base = new Date();
        base.setHours(Number(hours), Number(minutes), 0, 0);
        return formatEventDate(base).split("T")[1];
      };

      await updateRecurrence(
        {
          program_id: schedule.program?.id,
          location_id: location?.id,
          team_id: team?.id,
          recurrence_start_at: formatEventDate(
            new Date(form.getValues("recurrence_start_at"))
          ),
          recurrence_end_at: formatEventDate(
            new Date(form.getValues("recurrence_end_at"))
          ),
          event_start_at: formatTime(form.getValues("event_start_at")),
          event_end_at: formatTime(form.getValues("event_end_at")),
          day: form.getValues("day"),
        },
        schedule.id,
        jwt!
      );

      toast({
        description: "Schedule updated successfully",
        status: "success",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to update schedule", error);
      toast({
        description:
          error instanceof Error ? error.message : "Failed to update schedule",
        status: "error",
        variant: "destructive",
      });
    }
  }

  async function handleSave(event: React.MouseEvent) {
    event.preventDefault();

    if (isAddCard) await handleCreateSchedule(event);
    else await handleUpdateSchedule(event);
  }

  const isFormChanged = () => {
    const currentValues = form.getValues();
    const defaultValues = form.formState.defaultValues!;

    return Object.keys(currentValues).some((key) => {
      const currentValue = currentValues[key as keyof typeof currentValues];
      const defaultValue = defaultValues[key as keyof typeof defaultValues];

      return currentValue !== defaultValue;
    });
  };

  const handleReset = () => form.reset(form.formState.defaultValues!);

  useEffect(() => {
    (async () => {
      try {
        const [locations, teams] = await Promise.all([
          getAllLocations(),
          getAllTeams(),
        ]);
        setLocations(locations);
        setTeams(teams);
      } catch (error) {
        console.error("Failed to fetch locations and teams", error);
        toast({
          description: "Failed to fetch locations and teams",
          status: "error",
          variant: "destructive",
        });
      }
    })();
  }, []);

  return (
    <Card className="p-4 border-dashed border-2">
      <FormProvider {...form}>
        <form onSubmit={() => {}} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recurrence_start_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence Start Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recurrence_end_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence End Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_start_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_end_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toUpperCase()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <SelectItem key={day} value={day.toUpperCase()}>
                          {day.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            {!isAddCard && (
              <Button
                variant="outline"
                onClick={handleDeleteSchedule}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              variant="default"
              type="reset"
              onClick={handleReset}
              disabled={!isFormChanged()}
            >
              Reset to Default
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormChanged()}
              className="bg-green-600 hover:bg-green-700"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              {isAddCard ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}
