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

export default function AddSystemForm({
  onClose,
  onAdded,
}: {
  onClose?: () => void;
  onAdded?: () => void;
}) {
  const [name, setName] = useState(""); // Controlled input for new system name
  const { user } = useUser(); // User context for JWT
  const { toast } = useToast(); // Toast for notifications

  // Handle creating a new system via API
  const handleSave = async () => {
    const data: PlaygroundSystemRequestDto = { name };
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
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      {/* Save button */}
      <Button onClick={handleSave} className="w-full">
        Add System
      </Button>
    </div>
  );
}
