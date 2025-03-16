"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import getValue from "@/components/Singleton";
import { Membership } from "@/types/membership";

export default function AddMembershipForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const apiUrl = getValue("API");

  const membershipData = {
    name,
    description,
  };

  const handleAddMembership = async () => {
    if (!name.trim()) {
      toast.error("Membership name is required.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/memberships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(membershipData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create membership:", errorText);
        toast.error("Failed to save membership. Please try again.");
        return;
      }

      toast.success("Membership created successfully");
      
      // Reset form
      setName("");
      setDescription("");
      
      // You might want to redirect or reload data here
      setTimeout(() => window.location.reload(), 1000);
      
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
            Membership Name <span className="text-red-500">*</span>
          </label>
          <Input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            placeholder="Enter membership name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            rows={Math.max(4, description.split("\n").length)}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Describe membership benefits and features"
          />
        </div>
      </div>

      <Button onClick={handleAddMembership} className="w-full">Add Membership</Button>
    </div>
  );
}