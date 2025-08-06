"use client";

// Drawer panel used to view and edit an existing practice.

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, TrashIcon } from "lucide-react";
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
import { useFormData } from "@/hooks/form-data";
import { updatePractice, deletePractice } from "@/services/practices";
import { PracticeRequestDto } from "@/types/practice";
import { getAllLocations } from "@/services/location";
import { getAllTeams } from "@/services/teams";
import { getAllCourts } from "@/services/court";
import { revalidatePractices } from "@/actions/serverActions";
import { Practice } from "@/types/practice";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { Court } from "@/types/court";
import { toZonedISOString, fromZonedISOString } from "@/lib/utils";

export default function PracticeInfoPanel({
  practice,
  onClose,
  onUpdated,
  onDeleted,
}: {
  practice: Practice;
  onClose?: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}) {
  const { data, updateField } = useFormData({
    team_id: practice.team_id || "",
    location_id: practice.location_id || "",
    court_id: practice.court_id || "",
    start_at: fromZonedISOString(practice.start_at).toISOString().slice(0, 16),
    end_at: fromZonedISOString(practice.end_at).toISOString().slice(0, 16),
    capacity: practice.capacity,
    status: practice.status as "scheduled" | "completed" | "canceled",
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  const filteredCourts = courts.filter(
    (c) => c.location_id === data.location_id
  );

  useEffect(() => {
    // Load dropdown options for editing the practice
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

  // Persist any changes made to the practice
  const handleSave = async () => {
    if (!data.team_id || !data.location_id || !data.court_id) {
      toast({
        status: "error",
        description: "Team, location and court are required",
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

    const practiceData: PracticeRequestDto = {
      court_id: data.court_id,
      location_id: data.location_id,
      team_id: data.team_id,
      start_time: toZonedISOString(new Date(data.start_at)),
      end_time: toZonedISOString(new Date(data.end_at)),
      status: data.status,
    };

    const error = await updatePractice(practice.id, practiceData, user?.Jwt!);
    if (error === null) {
      toast({
        status: "success",
        description: "Practice updated successfully",
      });
      await revalidatePractices();
      if (onUpdated) onUpdated();
    } else {
      toast({
        status: "error",
        description: `Error saving changes: ${error}`,
        variant: "destructive",
      });
    }
  };

  // Remove the practice entirely from the system
  const handleDelete = async () => {
    const error = await deletePractice(practice.id, user?.Jwt!);
    if (error === null) {
      toast({
        status: "success",
        description: "Practice deleted successfully",
      });
      await revalidatePractices();
      if (onDeleted) onDeleted();
      if (onClose) onClose();
    } else {
      toast({
        status: "error",
        description: `Error deleting practice: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {practice.booked_by && (
        <p className="text-sm text-muted-foreground">
          Booked By: {practice.booked_by}
        </p>
      )}
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
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this practice? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
