"use client";

import React, { useEffect, useState } from "react"; // React and hooks for component lifecycle and state
import { Input } from "@/components/ui/input"; // Input UI component
import { Button } from "@/components/ui/button"; // Button UI component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select dropdown UI components
import { useUser } from "@/contexts/UserContext"; // Hook to access current user context
import { useToast } from "@/hooks/use-toast"; // Hook for showing toast notifications
import { useFormData } from "@/hooks/form-data"; // Hook for managing form state
import { createCourt } from "@/services/court"; // Service to call API for creating a court
import { getAllLocations } from "@/services/location"; // Service to fetch all locations
import { CourtRequestDto } from "@/app/api/Api"; // DTO type for court creation request
import { revalidateCourts } from "@/actions/serverActions"; // Action to revalidate court data on server
import { Location } from "@/types/location"; // Type definition for a location

export default function AddCourtForm() {
  // Initialize form data state with default values
  const { data, updateField, resetData } = useFormData({
    name: "",
    location_id: "",
  });
  const { user } = useUser(); // Get current user (for auth token)
  const { toast } = useToast(); // Initialize toast for feedback
  const [locations, setLocations] = useState<Location[]>([]); // State to hold list of locations

  useEffect(() => {
    // Fetch all locations when component mounts
    getAllLocations()
      .then(setLocations)
      .catch(() => {
        // Show error toast if locations fail to load
        toast({ status: "error", description: "Failed to load locations" });
      });
  }, [toast]);

  const handleAddCourt = async () => {
    // Validate that name and location are provided
    if (!data.name.trim() || !data.location_id) {
      toast({ status: "error", description: "Name and location are required" });
      return;
    }

    // Prepare request data
    const courtData: CourtRequestDto = {
      name: data.name,
      location_id: data.location_id,
    };

    // Call API to create the court
    const error = await createCourt(courtData, user?.Jwt!);
    if (error === null) {
      // On success, show success toast, reset form, and revalidate cache
      toast({ status: "success", description: "Court created successfully" });
      resetData();
      await revalidateCourts();
    } else {
      // On failure, show error toast with message
      toast({
        status: "error",
        description: `Failed to create court: ${error}`,
      });
    }
  };

  return (
    <div className="space-y-6 pt-3">
      <div className="space-y-4">
        <div className="space-y-2">
          {/* Label and input for court name */}
          <label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={(e) => updateField("name", e.target.value)} // Update form data on change
            type="text"
            value={data.name}
            placeholder="Enter court name"
          />
        </div>

        <div className="space-y-2">
          {/* Label and select for choosing a location */}
          <label className="text-sm font-medium">
            Location <span className="text-red-500">*</span>
          </label>
          <Select
            value={data.location_id}
            onValueChange={(value) => updateField("location_id", value)} // Update form data on select
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {/* Render a dropdown item for each fetched location */}
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Button to submit the form and add a new court */}
      <Button onClick={handleAddCourt} className="w-full">
        Add Court
      </Button>
    </div>
  );
}
