"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createLocation } from "@/services/location";
import { LocationRequestDto } from "@/app/api/Api";
import { useUser } from "@/contexts/UserContext";
import { useFormData } from "@/hooks/form-data";
import { revalidateLocations } from "@/actions/serverActions";
import { useToast } from "@/hooks/use-toast";
import { sanitizeTextInput } from "@/utils/inputValidation";
import { MapPin, Building } from "lucide-react";

interface AddFacilityFormProps {
  onSuccess?: () => void;
}

export default function AddFacilityForm({ onSuccess }: AddFacilityFormProps) {
  const { toast } = useToast();

  const { data, resetData, updateField } = useFormData({
    name: "",
    address: "",
  });

  const { user } = useUser();

  const handleAddFacility = async () => {
    if (!data.name.trim()) {
      toast({ status: "error", description: "Facility name is required." });
      return;
    }

    try {
      const locationData: LocationRequestDto = {
        ...data,
      };

      const error = await createLocation(locationData, user?.Jwt!);

      if (error === null) {
        resetData();

        toast({
          status: "success",
          description: "Location successfully created",
        });

        await revalidateLocations();
        onSuccess?.();

        return;
      }

      toast({
        status: "error",
        description: `Failed to create location: ${error}. Please try again.`,
      });
      return;
    } catch (error) {
      console.error("Error during API request:", error);
      toast({
        status: "error",
        description: `An error occurred: ${error}. Please try again.`,
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      {/* Facility Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Facility Information</h3>
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
                placeholder="Enter facility name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) =>
                  updateField("address", sanitizeTextInput(e.target.value))
                }
                type="text"
                value={data.address}
                placeholder="Enter facility address"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddFacility}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Create Location
        </Button>
      </div>
    </div>
  );
}
