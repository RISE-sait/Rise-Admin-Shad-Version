"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { createMembership } from "@/services/membership";
import { MembershipRequestDto } from "@/app/api/Api";
import { revalidateMemberships } from "@/actions/serverActions";
import { sanitizeTextInput } from "@/utils/inputValidation";
import { CreditCard, FileText } from "lucide-react";

export default function AddMembershipForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
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
      onSuccess?.();
    } catch (error) {
      console.error("Error during API request:", error);
      toast.error("Failed to add membership. Please try again.");
    }
  };

  return (
    <div className="space-y-6 pt-3">
      {/* Membership Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Membership Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Membership Name <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) => setName(sanitizeTextInput(e.target.value))}
                type="text"
                value={name}
                placeholder="Enter membership name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={Math.max(4, description.split("\n").length)}
                onChange={(e) => setDescription(sanitizeTextInput(e.target.value))}
                value={description}
                placeholder="Describe membership benefits and features"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddMembership}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Create Membership
        </Button>
      </div>
    </div>
  );
}
