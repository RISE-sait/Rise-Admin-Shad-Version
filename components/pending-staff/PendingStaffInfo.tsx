"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/user";
import { approveStaff } from "@/services/staff";
import { revalidatePendingStaffs } from "@/actions/serverActions";

// Props for individual pending staff info component
interface PendingStaffInfoProps {
  staff: User; // Staff member to display
  onApproved?: () => void; // Callback after approval
}

// Component showing details and approve button
export default function PendingStaffInfo({
  staff,
  onApproved,
}: PendingStaffInfoProps) {
  const { user } = useUser(); // Current user context
  const jwt = user?.Jwt; // JWT for auth
  const { toast } = useToast(); // Toast notifications
  const [loading, setLoading] = useState(false); // Button loading flag

  // Handler for approve action
  const handleApprove = async () => {
    if (!jwt) return;
    setLoading(true); // Show spinner text
    try {
      await approveStaff(staff.ID, jwt); // API call
      toast({ status: "success", description: "Staff approved" });
      await revalidatePendingStaffs(); // Refresh on server
      if (onApproved) onApproved(); // Notify parent
    } catch (err) {
      console.error("Approve failed", err);
      toast({
        status: "error",
        description: "Failed to approve staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset button
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Pending Staff</h3>
        <p className="text-sm text-muted-foreground">
          Review staff details before approval.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div>
          <span className="font-medium">Name:</span> {staff.Name}
        </div>
        {staff.Email && ( // Conditionally render email row
          <div>
            <span className="font-medium">Email:</span> {staff.Email}
          </div>
        )}
        {staff.Phone && ( // Conditionally render phone row
          <div>
            <span className="font-medium">Phone:</span> {staff.Phone}
          </div>
        )}
      </div>
      <Separator />
      <div className="flex justify-end">
        <Button
          onClick={handleApprove} // Approve click
          disabled={loading} // Disable when loading
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? "Approving..." : "Approve"} {/* Button text */}
        </Button>
      </div>
    </div>
  );
}
