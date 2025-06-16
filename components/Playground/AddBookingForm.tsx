// AddBookingForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { PlaygroundSystem, PlaygroundSession } from "@/types/playground";
import {
  createPlaygroundSession,
  updatePlaygroundSession,
} from "@/services/playground";
import { revalidatePlayground } from "@/actions/serverActions";

interface AddBookingFormProps {
  initialData?: PlaygroundSession;
  systems: PlaygroundSystem[];
  onClose?: () => void;
}

// Form for creating or editing a booking
export default function AddBookingForm({
  initialData,
  systems,
  onClose,
}: AddBookingFormProps) {
  // Initialize form state either from initialData (edit) or defaults (create)
  const [formData, setFormData] = useState<PlaygroundSession>(
    initialData || {
      id: "",
      system_id: systems[0]?.id || "",
      system_name: systems[0]?.name || "",
      customer_id: "",
      customer_first_name: "",
      customer_last_name: "",
      start_time: new Date(),
      end_time: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }
  );
  const { user } = useUser(); // Current user context (for JWT)
  const { toast } = useToast(); // Toast notifications

  // Handle form submission for create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Build DTO for API
    const dto = {
      system_id: formData.system_id,
      start_time: formData.start_time.toISOString(),
      end_time: formData.end_time.toISOString(),
    };

    // Call update if editing, otherwise create new session
    const error = formData.id
      ? await updatePlaygroundSession(formData.id, dto, user?.Jwt!)
      : await createPlaygroundSession(dto, user?.Jwt!);

    // Show error toast if API call failed
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        status: "error",
      });
      return;
    }

    // On success, show toast, revalidate server cache, and close drawer
    toast({
      title: "Success",
      description: "Session saved",
      status: "success",
    });
    await revalidatePlayground();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* System selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">System</label>
        <Select
          value={formData.system_id}
          onValueChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              system_id: val,
              system_name: systems.find((s) => s.id === val)?.name || "",
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select system" />
          </SelectTrigger>
          <SelectContent>
            {systems.map((sys) => (
              <SelectItem key={sys.id} value={sys.id}>
                {sys.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Start time field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Start Time</label>
        <Input
          type="datetime-local"
          value={format(formData.start_time, "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              start_time: new Date(e.target.value),
            }))
          }
        />
      </div>

      {/* End time field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">End Time</label>
        <Input
          type="datetime-local"
          value={format(formData.end_time, "yyyy-MM-dd'T'HH:mm")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              end_time: new Date(e.target.value),
            }))
          }
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
