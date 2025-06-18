"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/user";
import { approveStaff } from "@/services/staff";
import { revalidatePendingStaffs } from "@/actions/serverActions";

interface PendingStaffInfoProps {
  staff: User;
  onApproved?: () => void;
}

export default function PendingStaffInfo({
  staff,
  onApproved,
}: PendingStaffInfoProps) {
  const { user } = useUser();
  const jwt = user?.Jwt;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!jwt) return;
    setLoading(true);
    try {
      await approveStaff(staff.ID, jwt);
      toast({ status: "success", description: "Staff approved" });
      await revalidatePendingStaffs();
      if (onApproved) onApproved();
    } catch (err) {
      console.error("Approve failed", err);
      toast({
        status: "error",
        description: "Failed to approve staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        {staff.Email && (
          <div>
            <span className="font-medium">Email:</span> {staff.Email}
          </div>
        )}
        {staff.Phone && (
          <div>
            <span className="font-medium">Phone:</span> {staff.Phone}
          </div>
        )}
      </div>
      <Separator />
      <div className="flex justify-end">
        <Button
          onClick={handleApprove}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? "Approving..." : "Approve"}
        </Button>
      </div>
    </div>
  );
}
