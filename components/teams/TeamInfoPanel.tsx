"use client";

// Drawer panel that shows team details and allows basic editing and deletion.

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveIcon, TrashIcon, Users, Image as ImageIcon, UserCheck, Info, ClipboardList } from "lucide-react";
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
import { getAllStaffs } from "@/services/staff";
import { uploadTeamLogo } from "@/services/upload";
import { revalidateTeams } from "@/actions/serverActions";
import { Team } from "@/types/team";
import { TeamRequestDto } from "@/app/api/Api";
import { StaffRoleEnum, User as StaffUser } from "@/types/user";
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
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;
  const isAdmin = user?.Role === StaffRoleEnum.ADMIN || user?.Role === StaffRoleEnum.SUPERADMIN;

  const [name, setName] = useState(() => sanitizeTextInput(team.name));
  const [capacity, setCapacity] = useState<number>(team.capacity);
  const [coachId, setCoachId] = useState(team.coach_id || "");
  const [coaches, setCoaches] = useState<StaffUser[]>([]);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(team.logo_url || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [roster, setRoster] = useState(team.roster);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!isAdmin || team.is_external) return;

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
  }, [isAdmin, team.is_external, toast]);

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

    try {
      const teamData: TeamRequestDto = {
        name: trimmedName,
        capacity: capacity || 0,
        coach_id: coachId || undefined,
      };

      // Upload new logo if one was selected
      if (logoFile && user?.Jwt) {
        try {
          const logoUrl = await uploadTeamLogo(logoFile, user.Jwt, team.id);
          teamData.logo_url = logoUrl;
        } catch (uploadError) {
          toast({
            status: "error",
            description:
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload team logo",
            variant: "destructive",
          });
          return;
        }
      } else if (logoPreview && logoPreview !== team.logo_url) {
        // If logoPreview changed but no new file, keep the preview (shouldn't happen but just in case)
        teamData.logo_url = logoPreview;
      } else if (team.logo_url) {
        // Keep existing logo URL
        teamData.logo_url = team.logo_url;
      }

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
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1 rounded-none border-b border-border">
        <TabsTrigger
          value="details"
          className="flex items-center gap-2 px-6 py-3 rounded-none bg-transparent hover:bg-muted/50 transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          <Info className="h-4 w-4" />
          Details
        </TabsTrigger>
        {!team.is_external && user?.Role !== StaffRoleEnum.COACH && (
          <TabsTrigger
            value="roster"
            className="flex items-center gap-2 px-6 py-3 rounded-none bg-transparent hover:bg-muted/50 transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            <ClipboardList className="h-4 w-4" />
            Roster
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="details" className="space-y-6 mt-4">
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
                  disabled={isReceptionist}
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
                  disabled={isReceptionist}
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
                      setLogoFile(file);
                      const reader = new FileReader();
                      reader.onload = () =>
                        setLogoPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setLogoFile(null);
                    }
                    e.target.value = "";
                  }}
                  className="hidden"
                  id="team-logo-edit"
                  disabled={isReceptionist}
                />
                <label
                  htmlFor="team-logo-edit"
                  className={`block ${!isReceptionist ? 'cursor-pointer' : 'cursor-not-allowed'} ${!isReceptionist ? 'hover:opacity-80' : ''} transition-opacity`}
                >
                  {logoPreview ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <img
                          src={logoPreview}
                          alt="Team logo preview"
                          className="max-h-40 rounded object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Image selected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click to change
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-muted-foreground">
                      <p>Click to select an image</p>
                      <p className="text-sm">(JPG, PNG, WebP formats accepted)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {!team.is_external && (
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-lg">Coach Assignment</h3>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Coach</label>
                {isAdmin ? (
                  <Select
                    value={coachId || undefined}
                    onValueChange={(id) => setCoachId(id)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Coach">
                        {coachId ? coaches.find(c => c.ID === coachId)?.Name || team.coach_name : "Select Coach"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {coaches.map((c) => (
                        <SelectItem key={c.ID} value={c.ID}>
                          {c.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="border rounded-md px-3 py-2 bg-background">
                    {team.coach_name || "-"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {!isReceptionist && (
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
        )}
      </TabsContent>

      {!team.is_external && user?.Role !== StaffRoleEnum.COACH && (
        <TabsContent value="roster" className="mt-4">
          <div className="rounded-md border border-yellow-500 p-4 shadow">
            <h3 className="mb-2 text-xl font-semibold">
              Current Roster ({roster?.length || 0})
            </h3>
            {roster && roster.length > 0 ? (
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
            {!isReceptionist && (
              <Button
                className="mt-4 bg-yellow-500 text-black hover:bg-yellow-600"
                onClick={() => setRosterOpen(true)}
              >
                Manage Roster
              </Button>
            )}
          </div>
        </TabsContent>
      )}
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
    </Tabs>
  );
}