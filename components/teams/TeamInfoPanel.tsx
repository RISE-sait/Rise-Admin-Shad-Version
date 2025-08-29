"use client";

// Drawer panel that shows team details and allows basic editing and deletion.

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  const [roster, setRoster] = useState(team.roster);
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
        onClose?.();
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

  // Delete the team via API
  const handleDelete = async () => {
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
        {roster && (
          <div>
            <Separator className="my-2" />
            <div className="mt-4 rounded-md border border-yellow-500 p-4 shadow">
              <h3 className="mb-2 text-xl font-semibold">
                Current Roster ({roster.length})
              </h3>
              {roster.length > 0 ? (
                <ul className="divide-y rounded-md border">
                  {roster.map((member, index) => (
                    <li key={member.id} className="p-2 even:bg-secondary">
                      {index + 1}. {member.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-md border p-2 text-sm text-gray-500">
                  No players on roster, click manage roster to add players
                </p>
              )}
              <Button
                className="mt-4 bg-yellow-500 text-black hover:bg-yellow-600"
                onClick={() => setRosterOpen(true)}
              >
                Manage Roster
              </Button>
            </div>
          </div>
        )}
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
                  Are you sure you want to delete this team? This action cannot
                  be undone.
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
      <RightDrawer
        drawerOpen={rosterOpen}
        handleDrawerClose={() => setRosterOpen(false)}
        drawerWidth="w-[50%]"
      >
        <RosterEditor
          team={{ ...team, roster: roster || [] }}
          onClose={() => setRosterOpen(false)}
          onRosterChange={setRoster}
        />
      </RightDrawer>
    </>
  );
}
