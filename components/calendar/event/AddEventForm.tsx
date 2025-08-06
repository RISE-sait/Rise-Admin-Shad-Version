"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createEvent, createEvents } from "@/services/events";
import {
  EventCreateRequest,
  EventRecurrenceCreateRequest,
} from "@/types/events";
import { getAllPrograms } from "@/services/program";
import { getAllTeams } from "@/services/teams";
import { getAllLocations } from "@/services/location";
import { getAllCourts } from "@/services/court";
import { Program } from "@/types/program";
import { Team } from "@/types/team";
import { Location } from "@/types/location";
import { Court } from "@/types/court";
import { revalidateEvents } from "@/actions/serverActions";
import { useCalendarContext } from "../calendar-context";
import { CalendarEvent } from "@/types/calendar";
import { colorOptions } from "@/components/calendar/calendar-tailwind-classes";
import { toZonedISOString } from "@/lib/utils";

function getColorFromProgramType(programType?: string): string {
  switch (programType) {
    case "course":
      return colorOptions[2].value;
    case "tournament":
      return colorOptions[0].value;
    case "tryouts":
      return colorOptions[1].value;
    case "event":
      return colorOptions[3].value;
    case "game":
      return colorOptions[0].value;
    case "practice":
      return colorOptions[1].value;
    default:
      return "gray";
  }
}

export default function AddEventForm({ onClose }: { onClose?: () => void }) {
  const { data, updateField, resetData } = useFormData({
    program_id: "",
    team_id: "",
    location_id: "",
    court_id: "",
    start_at: "",
    end_at: "",
    recurrence_start_at: "",
    recurrence_end_at: "",
    event_start_at: "",
    event_end_at: "",
    day: "MONDAY",
    capacity: 0,
  });
  const { user } = useUser();
  const { toast } = useToast();
  const { setEvents, events } = useCalendarContext();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );
  const [mode, setMode] = useState<"once" | "recurring">("once");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [progs, tms, locs, crts] = await Promise.all([
          getAllPrograms("all"),
          getAllTeams(),
          getAllLocations(),
          getAllCourts(),
        ]);
        setPrograms(progs);
        setTeams(tms);
        setLocations(locs);
        setCourts(crts);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };

    fetchLists();
  }, []);

  const handleAddEvent = async () => {
    if (!data.program_id || !data.location_id) {
      toast({
        status: "error",
        description: "Program and location are required",
        variant: "destructive",
      });
      return;
    }

    let error: string | null = null;

    if (mode === "once") {
      if (!data.start_at || !data.end_at) {
        toast({
          status: "error",
          description: "Start and end time are required",
          variant: "destructive",
        });
        return;
      }

      const eventData: EventCreateRequest = {
        program_id: data.program_id,
        team_id: data.team_id || undefined,
        location_id: data.location_id,
        court_id: data.court_id ? data.court_id : null,
        start_at: toZonedISOString(new Date(data.start_at)),
        end_at: toZonedISOString(new Date(data.end_at)),
        capacity: data.capacity ? Number(data.capacity) : undefined,
      };

      error = await createEvent(eventData, user?.Jwt!);
    } else {
      if (
        !data.recurrence_start_at ||
        !data.recurrence_end_at ||
        !data.event_start_at ||
        !data.event_end_at ||
        !data.day
      ) {
        toast({
          status: "error",
          description: "All recurring fields are required",
          variant: "destructive",
        });
        return;
      }

      const formatTime = (t: string) => {
        const [h, m] = t.split(":");
        return `${h}:${m}:00+00:00`;
      };

      const startDate = new Date(data.recurrence_start_at);
      const endDate = new Date(data.recurrence_end_at);
      endDate.setHours(23, 59, 59, 999);

      const eventData: EventRecurrenceCreateRequest = {
        program_id: data.program_id,
        team_id: data.team_id || undefined,
        location_id: data.location_id,
        court_id: data.court_id ? data.court_id : null,
        recurrence_start_at: toZonedISOString(startDate),
        recurrence_end_at: toZonedISOString(endDate),
        event_start_at: formatTime(data.event_start_at),
        event_end_at: formatTime(data.event_end_at),
        day: data.day,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      };

      error = await createEvents(eventData, user?.Jwt!);
    }
    if (error === null) {
      toast({
        status: "success",
        description: "Event created successfully",
      });
      resetData();
      await revalidateEvents();
      if (mode === "once") {
        const program = programs.find((p) => p.id === data.program_id);
        const location = locations.find((l) => l.id === data.location_id);
        const team = teams.find((t) => t.id === data.team_id);
        const nameParts = (user?.Name || " ").split(" ");
        const firstName = nameParts.shift() || "";
        const lastName = nameParts.join(" ");
        const newEvent = {
          id: crypto.randomUUID(),
          color: getColorFromProgramType(program?.type),
          start_at: new Date(data.start_at),
          end_at: new Date(data.end_at),
          capacity: data.capacity ? Number(data.capacity) : 0,
          createdBy: { id: user?.ID || "", firstName, lastName },
          updatedBy: { id: user?.ID || "", firstName, lastName },
          customers: [],
          staff: [],
          program: {
            id: program?.id || "",
            name: program?.name || "",
            type: program?.type || "",
          },
          location: {
            id: location?.id || "",
            name: location?.name || "",
            address: location?.address || "",
          },
          team: { id: team?.id || "", name: team?.name || "" },
        } as CalendarEvent;
        setEvents([...events, newEvent]);
      } else {
        const program = programs.find((p) => p.id === data.program_id);
        const location = locations.find((l) => l.id === data.location_id);
        const team = teams.find((t) => t.id === data.team_id);
        const nameParts = (user?.Name || " ").split(" ");
        const firstName = nameParts.shift() || "";
        const lastName = nameParts.join(" ");

        const startDate = new Date(data.recurrence_start_at);
        const endDate = new Date(data.recurrence_end_at);
        const dayIndex = [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ].indexOf(data.day);
        const [startH, startM] = data.event_start_at.split(":");
        const [endH, endM] = data.event_end_at.split(":");
        const newEvents: CalendarEvent[] = [];
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          if (d.getDay() === dayIndex) {
            const eventStart = new Date(d);
            eventStart.setHours(parseInt(startH), parseInt(startM), 0, 0);
            const eventEnd = new Date(d);
            eventEnd.setHours(parseInt(endH), parseInt(endM), 0, 0);
            newEvents.push({
              id: crypto.randomUUID(),
              color: getColorFromProgramType(program?.type),
              start_at: eventStart,
              end_at: eventEnd,
              capacity: data.capacity ? Number(data.capacity) : 0,
              createdBy: { id: user?.ID || "", firstName, lastName },
              updatedBy: { id: user?.ID || "", firstName, lastName },
              customers: [],
              staff: [],
              program: {
                id: program?.id || "",
                name: program?.name || "",
                type: program?.type || "",
              },
              location: {
                id: location?.id || "",
                name: location?.name || "",
                address: location?.address || "",
              },
              team: { id: team?.id || "", name: team?.name || "" },
            } as CalendarEvent);
          }
        }
        setEvents([...events, ...newEvents]);
      }
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Failed to create event: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Program</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.program_id}
            onChange={(e) => updateField("program_id", e.target.value)}
          >
            <option value="" disabled>
              Select program
            </option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Team (optional)</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.team_id}
            onChange={(e) => updateField("team_id", e.target.value)}
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.location_id}
            onChange={(e) => {
              updateField("location_id", e.target.value);
              updateField("court_id", "");
            }}
          >
            <option value="" disabled>
              Select location
            </option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Court (optional)</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.court_id}
            onChange={(e) => updateField("court_id", e.target.value)}
          >
            <option value="">Select Court</option>
            {filteredCourts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>
        </div>

        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "once" | "recurring")}
          className="pt-2"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="once">One-time</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>
          <TabsContent value="once" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                value={data.start_at}
                onChange={(e) => updateField("start_at", e.target.value)}
                type="datetime-local"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                value={data.end_at}
                onChange={(e) => updateField("end_at", e.target.value)}
                type="datetime-local"
              />
            </div>
          </TabsContent>
          <TabsContent value="recurring" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recurrence Start</label>
              <Input
                value={data.recurrence_start_at}
                onChange={(e) =>
                  updateField("recurrence_start_at", e.target.value)
                }
                type="date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recurrence End</label>
              <Input
                value={data.recurrence_end_at}
                onChange={(e) =>
                  updateField("recurrence_end_at", e.target.value)
                }
                type="date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Day of Week</label>
              <select
                className="w-full border rounded-md p-2"
                value={data.day}
                onChange={(e) => updateField("day", e.target.value)}
              >
                {[
                  "MONDAY",
                  "TUESDAY",
                  "WEDNESDAY",
                  "THURSDAY",
                  "FRIDAY",
                  "SATURDAY",
                  "SUNDAY",
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                value={data.event_start_at}
                onChange={(e) => updateField("event_start_at", e.target.value)}
                type="time"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                value={data.event_end_at}
                onChange={(e) => updateField("event_end_at", e.target.value)}
                type="time"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Button onClick={handleAddEvent} className="w-full">
        Add Event
      </Button>
    </div>
  );
}
