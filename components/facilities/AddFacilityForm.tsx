"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import getValue from "@/configs/constants";

export default function AddFacilityForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const apiUrl = getValue("API");

  const facilityData = {
    name,
    location: address // This is the format the API expects
  };

  const handleAddFacility = async () => {
    if (!name.trim()) {
      toast.error("Facility name is required.");
      return;
    }

    try {
      const response = await fetch(apiUrl + `/locations`, {  // Changed from facilities to locations
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facilityData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to add facility:", errorText);
        toast.error("Failed to save facility. Please try again.");
        return;
      }

      toast.success("Facility Added Successfully");
      
      // Reset form
      setName("");
      setAddress("");
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