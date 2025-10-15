"use client";

// Form for coaches to create external teams (teams outside of Rise organization)
// External teams are used for booking games when coaches travel out of the city.
// These teams are shared across all coaches and don't require coach or roster assignment.

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Image as ImageIcon, Info } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useFormData } from "@/hooks/form-data";
import { createExternalTeam, ExternalTeamRequestDto } from "@/services/teams";
import { revalidateTeams } from "@/actions/serverActions";
import { useState } from "react";
import {
  sanitizeTextInput,
  TEAM_TEXT_INPUT_PATTERN,
  TEAM_TEXT_INPUT_PATTERN_STRING,
} from "@/utils/inputValidation";

export default function AddExternalTeamForm({
  onClose,
  onTeamAdded,
}: {
  onClose?: () => void;
  onTeamAdded?: () => void;
}) {
  const { data, updateField, resetData } = useFormData({
    name: "",
    capacity: 0,
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [logoData, setLogoData] = useState<string>("");
  const [logoName, setLogoName] = useState<string>("");

  const handleAddExternalTeam = async () => {
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

    const teamData: ExternalTeamRequestDto = {
      name: trimmedName,
      capacity: data.capacity || 0,
    };

    if (logoData) {
      teamData.logo_url = logoData;
    }

    try {
      const error = await createExternalTeam(teamData, user?.Jwt!);
      if (error === null) {
        toast({ status: "success", description: "External team created successfully" });
        resetData();
        setLogoData("");
        setLogoName("");
        await revalidateTeams();
        onTeamAdded?.();
        if (onClose) onClose();
      } else {
        toast({
          status: "error",
          description: `Failed to create external team: ${error}`,
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
      {/* Info Banner */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              External teams are used for booking games when you're out of the city.
              These teams don't belong to Rise and are shared across all coaches.
            </p>
          </div>
        </CardContent>
      </Card>

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
                placeholder="Enter external team name"
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
                    reader.onload = () => {
                      setLogoData(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="external-team-logo-upload"
              />
              <label
                htmlFor="external-team-logo-upload"
                className="block cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                {logoData ? (
                  <div className="space-y-2">
                    <p className="text-foreground font-medium">{logoName}</p>
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
            {logoData && (
              <div className="flex justify-center">
                <img src={logoData} alt="Preview" className="max-h-40 rounded" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddExternalTeam}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Users className="h-5 w-5 mr-2" />
          Create External Team
        </Button>
      </div>
    </div>
  );
}