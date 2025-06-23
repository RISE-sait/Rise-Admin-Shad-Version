"use client";

// Drawer panel used to view and edit an existing practice.

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { updatePractice, deletePractice } from "@/services/practices";
import { getAllLocations } from "@/services/location";
import { getAllTeams } from "@/services/teams";
import { getAllPrograms } from "@/services/program";
import { revalidatePractices } from "@/actions/serverActions";
import { Practice } from "@/types/practice";
import { Location } from "@/types/location";
import { Team } from "@/types/team";
import { Program } from "@/types/program";

export default function PracticeInfoPanel({
  practice,
  onClose,
}: {
  practice: Practice;
  onClose?: () => void;
}) {
  const { data, updateField } = useFormData({
    program_id: practice.program_id || "",
    team_id: practice.team_id || "",
    location_id: practice.location_id || "",
    start_at: new Date(practice.start_at).toISOString().slice(0, 16),
    end_at: new Date(practice.end_at).toISOString().slice(0, 16),
    capacity: practice.capacity,
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    // Load dropdown options for editing the practice
    const fetchLists = async () => {
      try {
        const [locs, tms, progs] = await Promise.all([
          getAllLocations(),
          getAllTeams(),
          getAllPrograms("practice"),
        ]);
        setLocations(locs);
        setTeams(tms);
        setPrograms(progs);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };

    fetchLists();
  }, []);

  // Persist any changes made to the practice
  const handleSave = async () => {
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

    const practiceData = {
      program_id: data.program_id,
      location_id: data.location_id,
      team_id: data.team_id || undefined,
      start_at: new Date(data.start_at).toISOString(),
      end_at: new Date(data.end_at).toISOString(),
      capacity: data.capacity || undefined,
    } as any;

    const error = await updatePractice(practice.id, practiceData, user?.Jwt!);
    if (error === null) {
      toast({
        status: "success",
        description: "Practice updated successfully",
      });
      await revalidatePractices();
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
    if (!confirm("Are you sure you want to delete this practice?")) return;
    const error = await deletePractice(practice.id, user?.Jwt!);
    if (error === null) {
      toast({
        status: "success",
        description: "Practice deleted successfully",
      });
      await revalidatePractices();
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
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Program</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.program_id}
            onChange={(e) => updateField("program_id", e.target.value)}
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Team</label>
          <select
            className="w-full border rounded-md p-2"
            value={data.team_id}
            onChange={(e) => updateField("team_id", e.target.value)}
          >
            <option value="">None</option>
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
            onChange={(e) => updateField("location_id", e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
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
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
        </Button>
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
          onClick={handleDelete}
        >
          <TrashIcon className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  );
}
