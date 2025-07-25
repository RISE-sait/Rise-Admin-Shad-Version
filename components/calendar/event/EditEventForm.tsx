"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { updateEvent } from "@/services/events";
import { EventCreateRequest } from "@/types/events";
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

export default function EditEventForm({ onClose }: { onClose?: () => void }) {
  const { user } = useUser();
  const { toast } = useToast();
  const { selectedEvent, setEvents, events } = useCalendarContext();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  const [data, setData] = useState({
    program_id: "",
    team_id: "",
    location_id: "",
    court_id: "",
    start_at: "",
    end_at: "",
  });

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );

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

  useEffect(() => {
    if (selectedEvent) {
      setData({
        program_id: selectedEvent.program.id,
        team_id: selectedEvent.team?.id || "",
        location_id: selectedEvent.location.id,
        court_id:
          (selectedEvent as any).court?.id ||
          (selectedEvent as any).court_id ||
          "",
        start_at: new Date(selectedEvent.start_at).toISOString().slice(0, 16),
        end_at: new Date(selectedEvent.end_at).toISOString().slice(0, 16),
      });
    }
  }, [selectedEvent]);

  const handleUpdate = async () => {
    if (!selectedEvent) return;
    if (!data.program_id || !data.location_id) {
      toast({
        status: "error",
        description: "Program and location are required",
        variant: "destructive",
      });
      return;
    }
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
      start_at: new Date(data.start_at).toISOString(),
      end_at: new Date(data.end_at).toISOString(),
    };

    const error = await updateEvent(selectedEvent.id, eventData, user?.Jwt!);

    if (error === null) {
      toast({ status: "success", description: "Event updated successfully" });
      await revalidateEvents();
      const program = programs.find((p) => p.id === data.program_id);
      const location = locations.find((l) => l.id === data.location_id);
      const team = teams.find((t) => t.id === data.team_id);
      const court = courts.find((c) => c.id === data.court_id);
      const nameParts = (user?.Name || " ").split(" ");
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");
      const updatedEvent: CalendarEvent = {
        ...selectedEvent,
        color: getColorFromProgramType(program?.type),
        start_at: new Date(data.start_at),
        end_at: new Date(data.end_at),
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
        court: court ? { id: court.id, name: court.name } : undefined,
        team: { id: team?.id || "", name: team?.name || "" },
        updatedBy: { id: user?.ID || "", firstName, lastName },
      };
      setEvents(
        events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Failed to update event: ${error}`,
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
            onChange={(e) => setData({ ...data, program_id: e.target.value })}
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
            onChange={(e) => setData({ ...data, team_id: e.target.value })}
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
              setData({ ...data, location_id: e.target.value, court_id: "" });
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
            onChange={(e) => setData({ ...data, court_id: e.target.value })}
          >
            <option value="">Select Court</option>
            {filteredCourts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Time</label>
          <Input
            value={data.start_at}
            onChange={(e) => setData({ ...data, start_at: e.target.value })}
            type="datetime-local"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Time</label>
          <Input
            value={data.end_at}
            onChange={(e) => setData({ ...data, end_at: e.target.value })}
            type="datetime-local"
          />
        </div>
      </div>
      <Button
        onClick={handleUpdate}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <SaveIcon className="h-4 w-4 mr-2" /> Save Event
      </Button>
    </div>
  );
}
