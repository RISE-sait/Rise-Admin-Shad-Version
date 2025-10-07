// AddSystemForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { createPlaygroundSystem } from "@/services/playground";
import { PlaygroundSystemRequestDto } from "@/types/playground";
import { revalidatePlayground } from "@/actions/serverActions";

const SYSTEM_NAME_REGEX = /^[\p{L}\p{N}\s'&()\-]+$/u;

export default function AddSystemForm({
  onClose,
  onAdded,
}: {
  onClose?: () => void;
  onAdded?: () => void;
}) {
  const [name, setName] = useState(""); // Controlled input for new system name
  const [nameError, setNameError] = useState<string | null>(null);
  const { user } = useUser(); // User context for JWT
  const { toast } = useToast(); // Toast for notifications

  const handleNameChange = (value: string) => {
    setName(value);

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setNameError(null);
      return;
    }

    if (!SYSTEM_NAME_REGEX.test(trimmedValue)) {
      setNameError(
        "System name may include letters, numbers, spaces, apostrophes, ampersands, parentheses, and hyphens."
      );
    } else {
      setNameError(null);
    }
  };

  // Handle creating a new system via API
  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("System name is required.");
      toast({
        title: "Validation Error",
        description: "Please enter a system name before submitting.",
        status: "error",
        variant: "destructive",
      });
      return;
    }

    if (!SYSTEM_NAME_REGEX.test(trimmedName)) {
      setNameError(
        "System name may include letters, numbers, spaces, apostrophes, ampersands, parentheses, and hyphens."
      );
      toast({
        title: "Validation Error",
        description: "System name contains unsupported characters.",
        status: "error",
        variant: "destructive",
      });
      return;
    }

    const data: PlaygroundSystemRequestDto = { name: trimmedName };
    const error = await createPlaygroundSystem(data, user?.Jwt!);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        status: "error",
      });
      return;
    }
    toast({
      title: "Success",
      description: "System created.",
      status: "success",
    });
    await revalidatePlayground();
    if (onAdded) onAdded();
    if (onClose) onClose();
  };

  return (
    <div className="space-y-4 pt-3">
      {/* System Name input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">System Name</label>
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. PS5 - Station 1"
        />
        {nameError && (
          <p className="text-sm text-destructive" role="alert">
            {nameError}
          </p>
        )}
      </div>
      {/* Save button */}
      <Button
        onClick={handleSave}
        className="w-full"
        disabled={Boolean(nameError) || !name.trim()}
      >
        Add System
      </Button>
    </div>
  );
}
