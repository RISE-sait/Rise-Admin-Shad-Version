"use client";

// Form shown in the right drawer for creating either a
// one-time or recurring practice event.

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getUserTeams } from "@/services/teams";
import { getAllCourts } from "@/services/court";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { Court } from "@/types/court";
import { revalidatePractices } from "@/actions/serverActions";
import { toZonedISOString } from "@/lib/utils";
import { Dumbbell, Calendar, MapPin } from "lucide-react";

export default function AddPracticeForm({
  onClose,
  onAdded,
}: {
  onClose?: () => void;
  onAdded?: () => void;
}) {
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
    if (!user?.Jwt) return;
    // Fetch available teams and locations for the dropdown lists
    const fetchLists = async () => {
      try {
        const [locs, tms, crts] = await Promise.all([
          getAllLocations(),
          getUserTeams(user.Jwt),
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
  }, [user?.Jwt]);

  // Create the practice using the chosen mode
  const handleAddPractice = async () => {
    if (!data.team_id || !data.location_id) {
      toast({
        status: "error",
        description: "Team and location are required",
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
        court_id: data.court_id || undefined,
        location_id: data.location_id,
        team_id: data.team_id,
        start_time: toZonedISOString(new Date(data.start_at)),
        end_time: toZonedISOString(new Date(data.end_at)),
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
        court_id: data.court_id || undefined,
        location_id: data.location_id,
        team_id: data.team_id,
        recurrence_start_at: toZonedISOString(
          new Date(data.recurrence_start_at)
        ),
        recurrence_end_at: toZonedISOString(new Date(data.recurrence_end_at)),
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
      if (onAdded) onAdded();
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
      {/* Practice Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Practice Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Team <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.team_id}
                onValueChange={(value) => updateField("team_id", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.location_id}
                onValueChange={(value) => {
                  updateField("location_id", value);
                  updateField("court_id", "");
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Court</label>
              <Select
                value={data.court_id}
                onValueChange={(value) => updateField("court_id", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select court (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Schedule</h3>
          </div>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "once" | "recurring")}
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="once">One-time</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>
            <TabsContent value="once" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.start_at}
                  onChange={(e) => updateField("start_at", e.target.value)}
                  type="datetime-local"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.end_at}
                  onChange={(e) => updateField("end_at", e.target.value)}
                  type="datetime-local"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={data.status}
                  onValueChange={(value) =>
                    updateField(
                      "status",
                      value as "scheduled" | "completed" | "canceled"
                    )
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="recurring" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Recurrence Start <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.recurrence_start_at}
                  onChange={(e) =>
                    updateField("recurrence_start_at", e.target.value)
                  }
                  type="datetime-local"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Recurrence End <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.recurrence_end_at}
                  onChange={(e) =>
                    updateField("recurrence_end_at", e.target.value)
                  }
                  type="datetime-local"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Day of Week <span className="text-red-500">*</span>
                </label>
                <Select
                  value={data.day}
                  onValueChange={(value) => updateField("day", value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "MONDAY",
                      "TUESDAY",
                      "WEDNESDAY",
                      "THURSDAY",
                      "FRIDAY",
                      "SATURDAY",
                      "SUNDAY",
                    ].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.event_start_at}
                  onChange={(e) => updateField("event_start_at", e.target.value)}
                  type="time"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time <span className="text-red-500">*</span>
                </label>
                <Input
                  value={data.event_end_at}
                  onChange={(e) => updateField("event_end_at", e.target.value)}
                  type="time"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={data.status}
                  onValueChange={(value) =>
                    updateField(
                      "status",
                      value as "scheduled" | "completed" | "canceled"
                    )
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddPractice}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Dumbbell className="h-5 w-5 mr-2" />
          Create Practice
        </Button>
      </div>
    </div>
  );
}
