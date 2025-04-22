"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createLocation } from "@/services/location";
import { LocationRequestDto } from "@/app/api/Api";
import { useUser } from "@/contexts/UserContext";
import { useFormData } from "@/hooks/form-data";
import { revalidateLocations } from "@/actions/serverActions";
import { useToast } from "@/hooks/use-toast"

export default function AddFacilityForm() {

    const { toast } = useToast()
  
  const { data, resetData, updateField } = useFormData(
    { name: "", address: "", },
  )

  const { user } = useUser();

  const handleAddFacility = async () => {
    if (!data.name.trim()) {
      toast({ status: "error", description: "Facility name is required." });
      return;
    }

    try {

      const locationData: LocationRequestDto = {
        ...data
      }

      const error = await createLocation(locationData, user?.Jwt!)

      if (error === null) {

        resetData();

        toast({ status: "success", description: "Location successfully created" });
        
        await revalidateLocations()

        return;
      }

      toast({ status: "error", description: `Failed to create location: ${error}. Please try again.` });
      return;

    } catch (error) {
      console.error("Error during API request:", error);
      toast({ status: "error", description: `An error occurred: ${error}. Please try again.` });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={(e) => updateField('name', e.target.value)}
            type="text"
            value={data.name}
            placeholder="Enter facility name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
          Address <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={(e) => updateField('address', e.target.value)}
            type="text"
            value={data.address}
            placeholder="Enter facility address"
          />
        </div>
      </div>

      <Button onClick={handleAddFacility} className="w-full">Add Facility</Button>
    </div>
  );
}