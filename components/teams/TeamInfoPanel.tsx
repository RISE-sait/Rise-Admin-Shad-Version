"use client";

// Drawer panel that shows team details and allows basic editing and deletion.

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { SaveIcon, TrashIcon, Users, Image as ImageIcon, UserCheck } from "lucide-react";
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
import { StaffRoleEnum } from "@/types/user";
import {
  sanitizeTextInput,
  TEAM_TEXT_INPUT_PATTERN,
  TEAM_TEXT_INPUT_PATTERN_STRING,
} from "@/utils/inputValidation";

export default function TeamInfoPanel({
  team,
  onClose,
  onTeamChanged,
}: {
  team: Team;
  onClose?: () => void;
  onTeamChanged?: () => void;
}) {
  const [name, setName] = useState(() => sanitizeTextInput(team.name));
  const [capacity, setCapacity] = useState<number>(team.capacity);
  const [coachId] = useState(team.coach_id || "");
  const [rosterOpen, setRosterOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(team.logo_url || "");
  const [logoName, setLogoName] = useState<string>("");
  const [roster, setRoster] = useState(team.roster);
  const { user } = useUser();
  const { toast } = useToast();

  // Save any edits made to the team and refresh the table
  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast({
        status: "error",
        description: "Team name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!TEAM_TEXT_INPUT_PATTERN.test(trimmedName)) {
      toast({
        status: "error",
        description:
          "Team name contains invalid characters. Please use only letters, numbers, spaces, commas, periods, apostrophes, and hyphens.",
        variant: "destructive",
      });
      return;
    }
    const teamData: TeamRequestDto = {
      name: trimmedName,
      capacity: capacity || 0,
      coach_id: coachId || undefined,
    };
    if (logoPreview) {
      teamData.logo_url = logoPreview;
    }
    try {
      const error = await updateTeam(team.id, teamData, user?.Jwt!);
      if (error === null) {
        toast({ status: "success", description: "Team updated successfully" });
        await revalidateTeams();
        onTeamChanged?.();
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
        onTeamChanged?.();
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
        {/* Team Details Section */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">Team Details</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(sanitizeTextInput(e.target.value))}
                  pattern={TEAM_TEXT_INPUT_PATTERN_STRING}
                  title="Only letters, numbers, spaces, commas, periods, apostrophes, and hyphens are allowed."
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <Input
                  type="number"
                  min={0}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Logo Section */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">Team Logo</h3>
            </div>
            <div className="space-y-2">
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-background">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogoName(file.name);
                      const reader = new FileReader();
                      reader.onload = () =>
                        setLogoPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="team-logo-edit"
                />
                <label
                  htmlFor="team-logo-edit"
                  className="block cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  {logoPreview ? (
                    <div className="space-y-2">
                      <p className="text-foreground font-medium">
                        {logoName || "Image selected"}
                      </p>
                      <p className="text-sm">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>Click to select an image</p>
                      <p className="text-sm">(JPG, PNG, WebP formats accepted)</p>
                    </div>
                  )}
                </label>
              </div>
              {logoPreview && (
                <div className="flex justify-center">
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="max-h-40 rounded"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

          {!team.is_external && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Coach</label>
              <p className="border rounded-md px-3 py-2">
                {team.coach_name || "-"}
              </p>
            </div>
          )}
        </div>
        {!team.is_external && roster && (
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
        <Separator />

        <div className="flex items-center justify-end gap-3 pt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" /> Delete Team
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
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            onClick={handleSave}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
          >
            <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
          </Button>
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