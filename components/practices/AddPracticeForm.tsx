"use client";

// Form shown in the right drawer for creating either a
// one-time or recurring practice event.

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createPractice, createRecurringPractice } from "@/services/practices";
import {
  PracticeRequestDto,
  PracticeRecurrenceRequestDto,
} from "@/types/practice";
import { getAllLocations } from "@/services/location";
import { getAllTeams } from "@/services/teams";
import { getAllCourts } from "@/services/court";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { Court } from "@/types/court";
import { revalidatePractices } from "@/actions/serverActions";

export default function AddPracticeForm({ onClose }: { onClose?: () => void }) {
  const { data, updateField, resetData } = useFormData({
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
    status: "scheduled" as "scheduled" | "completed" | "canceled",
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );
  const [mode, setMode] = useState<"once" | "recurring">("once");

  useEffect(() => {
    // Fetch available teams and locations for the dropdown lists
    const fetchLists = async () => {
      try {
        const [locs, tms, crts] = await Promise.all([
          getAllLocations(),
          getAllTeams(),
          getAllCourts(),
        ]);
        setLocations(locs);
        setTeams(tms);
        setCourts(crts);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };

    fetchLists();
  }, []);

  // Create the practice using the chosen mode
  const handleAddPractice = async () => {
    if (!data.team_id || !data.location_id || !data.court_id) {
      toast({
        status: "error",
        description: "Team, location and court are required",
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

      const practiceData: PracticeRequestDto = {
        court_id: data.court_id,
        location_id: data.location_id,
        team_id: data.team_id,
        start_time: new Date(data.start_at).toISOString(),
        end_time: new Date(data.end_at).toISOString(),
        status: data.status,
      };

      error = await createPractice(practiceData, user?.Jwt!);
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

      // Convert a HH:MM time string into the format the API expects
      const formatTime = (t: string) => {
        const [h, m] = t.split(":");
        return `${h}:${m}:00+00:00`;
      };

      const practiceData: PracticeRecurrenceRequestDto = {
        court_id: data.court_id,
        location_id: data.location_id,
        team_id: data.team_id,
        recurrence_start_at: new Date(data.recurrence_start_at).toISOString(),
        recurrence_end_at: new Date(data.recurrence_end_at).toISOString(),
        practice_start_at: formatTime(data.event_start_at),
        practice_end_at: formatTime(data.event_end_at),
        day: data.day,
        status: data.status,
      };

      error = await createRecurringPractice(practiceData, user?.Jwt!);
    }
    if (error === null) {
      toast({
        status: "success",
        description: "Practice created successfully",
      });
      resetData();
      await revalidatePractices();
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Failed to create practice: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Team</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.team_id}
            onChange={(e) => updateField("team_id", e.target.value)}
          >
            <option value="" disabled>
              Select team
            </option>
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
          <label className="text-sm font-medium">Court</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.court_id}
            onChange={(e) => updateField("court_id", e.target.value)}
          >
            <option value="" disabled>
              Select court
            </option>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full border rounded-md p-2"
                value={data.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value as "scheduled" | "completed" | "canceled"
                  )
                }
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
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
                type="datetime-local"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recurrence End</label>
              <Input
                value={data.recurrence_end_at}
                onChange={(e) =>
                  updateField("recurrence_end_at", e.target.value)
                }
                type="datetime-local"
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full border rounded-md p-2"
                value={data.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value as "scheduled" | "completed" | "canceled"
                  )
                }
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Button onClick={handleAddPractice} className="w-full">
        Add Practice
      </Button>
    </div>
  );
}
