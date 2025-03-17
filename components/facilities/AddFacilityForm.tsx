"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import getValue from "@/configs/constants";
import { createLocation } from "@/services/location";
import { LocationRequestDto } from "@/app/api/Api";
import { useUser } from "@/contexts/UserContext";

export default function AddFacilityForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const { user } = useUser();

  const handleAddFacility = async () => {
    if (!name.trim()) {
      toast.error("Facility name is required.");
      return;
    }

    try {

      const locationData: LocationRequestDto = {
        address: address,
        name: name
      }

      await createLocation(locationData, user?.Jwt!);
    } catch (error) {
      console.error("Error during API request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6 pt-3">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Facility Name <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            placeholder="Enter facility name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            value={address}
            placeholder="Enter facility address"
          />
        </div>
      </div>

      <Button onClick={handleAddFacility} className="w-full">Add Facility</Button>
    </div>
  );
}