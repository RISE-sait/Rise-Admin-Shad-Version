"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { createCourt } from "@/services/court";
import { getAllLocations } from "@/services/location";
import { CourtRequestDto } from "@/app/api/Api";
import { revalidateCourts } from "@/actions/serverActions";
import { Location } from "@/types/location";
import { sanitizeTextInput } from "@/utils/inputValidation";
import { Grid3x3, MapPin } from "lucide-react";

export default function AddCourtForm({
  onCourtAdded,
}: {
  onCourtAdded?: () => void;
}) {
  const { data, updateField, resetData } = useFormData({
    name: "",
    location_id: "",
  });
  const { user } = useUser();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    getAllLocations()
      .then(setLocations)
      .catch(() => {
        toast({ status: "error", description: "Failed to load locations" });
      });
  }, [toast]);

  const handleAddCourt = async () => {
    if (!data.name.trim() || !data.location_id) {
      toast({ status: "error", description: "Name and location are required" });
      return;
    }

    const courtData: CourtRequestDto = {
      name: data.name,
      location_id: data.location_id,
    };

    const error = await createCourt(courtData, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Court created successfully" });
      resetData();
      await revalidateCourts();
      onCourtAdded?.();
    } else {
      toast({
        status: "error",
        description: `Failed to create court: ${error}`,
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      {/* Court Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Grid3x3 className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Court Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) =>
                  updateField("name", sanitizeTextInput(e.target.value))
                }
                type="text"
                value={data.name}
                placeholder="Enter court name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <Select
                value={data.location_id}
                onValueChange={(value) => updateField("location_id", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddCourt}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Grid3x3 className="h-5 w-5 mr-2" />
          Create Court
        </Button>
      </div>
    </div>
  );
}
