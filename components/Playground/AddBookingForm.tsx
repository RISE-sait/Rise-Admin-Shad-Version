// AddBookingForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toZonedISOString } from "@/lib/utils";
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
import { Gamepad2, Calendar } from "lucide-react";

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
      start_time: toZonedISOString(formData.start_time),
      end_time: toZonedISOString(formData.end_time),
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
    <form onSubmit={handleSubmit} className="space-y-6 pt-3">
      {/* Session Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Session Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                System <span className="text-red-500">*</span>
              </label>
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
                <SelectTrigger className="bg-background">
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
          </div>
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Schedule</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start Time <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                value={format(formData.start_time, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_time: new Date(e.target.value),
                  }))
                }
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                End Time <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                value={format(formData.end_time, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    end_time: new Date(e.target.value),
                  }))
                }
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Gamepad2 className="h-5 w-5 mr-2" />
          {formData.id ? "Update Session" : "Create Session"}
        </Button>
      </div>
    </form>
  );
}
