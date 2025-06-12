"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createTeam } from "@/services/teams";
import { TeamRequestDto } from "@/app/api/Api";
import { revalidateTeams } from "@/actions/serverActions";

export default function AddTeamForm({ onClose }: { onClose?: () => void }) {
  const { data, updateField, resetData } = useFormData({
    name: "",
    capacity: 0,
    coach_id: "",
  });
  const { user } = useUser();
  const { toast } = useToast();

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
          <label className="text-sm font-medium">Coach ID</label>
          <Input
            value={data.coach_id}
            onChange={(e) => updateField("coach_id", e.target.value)}
            type="text"
            placeholder="Coach ID (optional)"
          />
        </div>
      </div>

      <Button onClick={handleAddTeam} className="w-full">
        Add Team
      </Button>
    </div>
  );
}
