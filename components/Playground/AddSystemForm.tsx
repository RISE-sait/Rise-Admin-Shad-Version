// AddSystemForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { createPlaygroundSystem } from "@/services/playground";
import { PlaygroundSystemRequestDto } from "@/types/playground";
import { revalidatePlayground } from "@/actions/serverActions";
import { Gamepad2 } from "lucide-react";

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
    <div className="space-y-6 pt-3">
      {/* System Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">System Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                System Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. PS5 - Station 1"
                className="bg-background"
              />
              {nameError && (
                <p className="text-sm text-destructive" role="alert">
                  {nameError}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleSave}
          disabled={Boolean(nameError) || !name.trim()}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Gamepad2 className="h-5 w-5 mr-2" />
          Add System
        </Button>
      </div>
    </div>
  );
}
