"use client";

// Drawer panel that shows team details and allows basic editing and deletion.

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SaveIcon, TrashIcon } from "lucide-react";
import RightDrawer from "@/components/reusable/RightDrawer";
import RosterEditor from "./RosterEditor";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { updateTeam, deleteTeam } from "@/services/teams";
import { revalidateTeams } from "@/actions/serverActions";
import { Team } from "@/types/team";
import { TeamRequestDto } from "@/app/api/Api";

export default function TeamInfoPanel({
  team,
  onClose,
}: {
  team: Team;
  onClose?: () => void;
}) {
  const [name, setName] = useState(team.name);
  const [capacity, setCapacity] = useState<number>(team.capacity);
  const [coachId] = useState(team.coach_id || "");
  const [rosterOpen, setRosterOpen] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  // Save any edits made to the team and refresh the table
  const handleSave = async () => {
    const teamData: TeamRequestDto = {
      name,
      capacity: capacity || 0,
      coach_id: coachId || undefined,
    };
    try {
      const error = await updateTeam(team.id, teamData, user?.Jwt!);
      if (error === null) {
        toast({ status: "success", description: "Team updated successfully" });
        await revalidateTeams();
      } else {
        toast({
          status: "error",
          description: `Error saving changes: ${error}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        status: "error",
        description: "Error updating team",
        variant: "destructive",
      });
    }
  };

  // Prompt for confirmation and delete the team via API
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      const error = await deleteTeam(team.id, user?.Jwt!);
      if (error === null) {
        toast({ status: "success", description: "Team deleted successfully" });
        await revalidateTeams();
        if (onClose) onClose();
      } else {
        toast({
          status: "error",
          description: `Error deleting team: ${error}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        status: "error",
        description: "Error deleting team",
        variant: "destructive",
      });
    }
  };

  // Render form fields along with roster info and action buttons
  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Team Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Capacity</label>
            <Input
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Coach</label>
            <p className="border rounded-md px-3 py-2">
              {team.coach_name || "-"}
            </p>
          </div>
        </div>
        {team.roster && (
          <div>
            <Separator className="my-2" />
            <h3 className="text-xl font-semibold mt-4 mb-2">Roster</h3>
            <ul className="border rounded-md divide-y">
              {team.roster.map((member) => (
                <li key={member.id} className="p-2">
                  {member.name}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setRosterOpen(true)}
            >
              Manage Roster
            </Button>
          </div>
        )}
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
      <RightDrawer
        drawerOpen={rosterOpen}
        handleDrawerClose={() => setRosterOpen(false)}
        drawerWidth="w-[75%]"
      >
        <RosterEditor team={team} onClose={() => setRosterOpen(false)} />
      </RightDrawer>
    </>
  );
}
