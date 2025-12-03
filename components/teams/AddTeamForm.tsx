"use client";

// Simple form used to create a new team and persist it via the API.
// Provides optional onClose callback for parent components.

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
import { Users, Image as ImageIcon, Hash } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createTeam } from "@/services/teams";
import { getAllStaffs } from "@/services/staff";
import { uploadTeamLogo } from "@/services/upload";
import { TeamRequestDto } from "@/app/api/Api";
import { revalidateTeams } from "@/actions/serverActions";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import {
  sanitizeTextInput,
  TEAM_TEXT_INPUT_PATTERN,
  TEAM_TEXT_INPUT_PATTERN_STRING,
} from "@/utils/inputValidation";

export default function AddTeamForm({
  onClose,
  onTeamAdded,
}: {
  onClose?: () => void;
  onTeamAdded?: () => void;
}) {
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

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
    const trimmedName = data.name.trim();

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

    if (!data.coach_id) {
      toast({
        status: "error",
        description: "Coach is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const teamData: TeamRequestDto = {
        name: trimmedName,
        capacity: data.capacity || 0,
        coach_id: data.coach_id,
      };

      // Upload logo first if provided
      if (logoFile && user?.Jwt) {
        try {
          const logoUrl = await uploadTeamLogo(logoFile, user.Jwt);
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
      }

      const error = await createTeam(teamData, user?.Jwt!);
      if (error === null) {
        toast({ status: "success", description: "Team created successfully" });
        resetData();
        setLogoFile(null);
        setLogoPreview("");
        await revalidateTeams();
        onTeamAdded?.();
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
      {/* Team Details Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Team Details</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Team Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={data.name}
                onChange={(e) =>
                  updateField("name", sanitizeTextInput(e.target.value))
                }
                type="text"
                placeholder="Enter team name"
                pattern={TEAM_TEXT_INPUT_PATTERN_STRING}
                title="Only letters, numbers, spaces, commas, periods, apostrophes, and hyphens are allowed."
                className="bg-background"
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
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Coach Assignment <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.coach_id}
                onValueChange={(id) => updateField("coach_id", id)}
              >
                <SelectTrigger className="bg-background">
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
                    reader.onload = () => {
                      setLogoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setLogoFile(null);
                    setLogoPreview("");
                  }
                  e.target.value = "";
                }}
                className="hidden"
                id="team-logo-upload"
              />
              <label
                htmlFor="team-logo-upload"
                className="block cursor-pointer hover:opacity-80 transition-opacity"
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

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddTeam}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Users className="h-5 w-5 mr-2" />
          Create Team
        </Button>
      </div>
    </div>
  );
}