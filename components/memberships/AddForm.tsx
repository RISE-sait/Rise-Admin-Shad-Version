"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import getValue from "@/configs/constants";
import { useUser } from "@/contexts/UserContext";
import { createMembership } from "@/services/membership";
import { MembershipRequestDto } from "@/app/api/Api";
import { revalidateMemberships } from "@/actions/serverActions";

export default function AddMembershipForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useUser();

  const membershipData: MembershipRequestDto = {
    name,
    description,
  };

  const handleAddMembership = async () => {
    if (!name.trim()) {
      toast.error("Membership name is required.");
      return;
    }

    try {
      await createMembership(membershipData, user?.Jwt!);

      // Reset form
      setName("");
      setDescription("");

      await revalidateMemberships();

      toast.success("Membership created successfully");


    } catch (error) {
      console.error("Error during API request:", error);
      toast.error("Failed to add membership. Please try again.");
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