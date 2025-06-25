"use client";

// Simple form used to create a new team and persist it via the API.
// Provides optional onClose callback for parent components.

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createTeam } from "@/services/teams";
import { getAllStaffs } from "@/services/staff";
import { TeamRequestDto } from "@/app/api/Api";
import { revalidateTeams } from "@/actions/serverActions";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export default function AddTeamForm({ onClose }: { onClose?: () => void }) {
  // useFormData provides a simple object based form state manager
  // with helpers for updating and resetting the data fields.
  const { data, updateField, resetData } = useFormData({
    name: "",
    capacity: 0,
    coach_id: "",
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [coaches, setCoaches] = useState<User[]>([]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const coachData = await getAllStaffs("COACH");
        setCoaches(coachData);
      } catch (error) {
        toast({
          status: "error",
          description:
            error instanceof Error ? error.message : "Failed to load coaches",
          variant: "destructive",
        });
      }
    };

    fetchCoaches();
  }, [toast]);

  // Submit handler that validates input and calls the createTeam API.
  // If successful it resets the form and optionally closes the drawer.
  const handleAddTeam = async () => {
    if (!data.name.trim()) {
      toast({
        status: "error",
        description: "Team name is required.",
        variant: "destructive",
      });
      return;
    }

    const teamData: TeamRequestDto = {
      name: data.name,
      capacity: data.capacity || 0,
      coach_id: data.coach_id || undefined,
    };

    try {
      const error = await createTeam(teamData, user?.Jwt!);
      if (error === null) {
        toast({ status: "success", description: "Team created successfully" });
        resetData();
        await revalidateTeams();
        if (onClose) onClose();
      } else {
        toast({
          status: "error",
          description: `Failed to create team: ${error}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        status: "error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Render the minimal form layout using shadcn/ui components
  return (
    <div className="space-y-6 pt-3">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Team Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            type="text"
            placeholder="Enter team name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Capacity</label>
          <Input
            value={data.capacity}
            onChange={(e) => updateField("capacity", parseInt(e.target.value))}
            type="number"
            min={0}
            placeholder="Team capacity"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Coach</label>
          <Select
            value={data.coach_id}
            onValueChange={(id) => updateField("coach_id", id)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Coach" />
            </SelectTrigger>
            <SelectContent>
              {coaches.map((c) => (
                <SelectItem key={c.ID} value={c.ID}>
                  {c.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleAddTeam} className="w-full">
        Add Team
      </Button>
    </div>
  );
}
