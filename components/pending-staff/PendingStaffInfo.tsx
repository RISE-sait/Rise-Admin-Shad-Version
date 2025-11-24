"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/user";
import { approveStaff, rejectStaff } from "@/services/staff";
import { revalidatePendingStaffs } from "@/actions/serverActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [rejecting, setRejecting] = useState(false); // Reject button loading flag
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false); // Reject confirmation dialog

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

  // Handler for reject action
  const handleReject = async () => {
    if (!jwt) return;
    setRejecting(true); // Show spinner text
    try {
      await rejectStaff(staff.ID, jwt); // API call
      toast({ status: "success", description: "Staff registration rejected" });
      await revalidatePendingStaffs(); // Refresh on server
      setRejectDialogOpen(false); // Close dialog
      if (onApproved) onApproved(); // Notify parent to refresh
    } catch (err) {
      console.error("Reject failed", err);
      toast({
        status: "error",
        description: err instanceof Error ? err.message : "Failed to reject staff",
        variant: "destructive",
      });
    } finally {
      setRejecting(false); // Reset button
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
      <div className="flex justify-end gap-3">
        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              disabled={loading || rejecting}
            >
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Staff Registration</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject {staff.Name}'s registration? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={rejecting}>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={rejecting}
              >
                {rejecting ? "Rejecting..." : "Reject"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          onClick={handleApprove} // Approve click
          disabled={loading || rejecting} // Disable when loading
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? "Approving..." : "Approve"} {/* Button text */}
        </Button>
      </div>
    </div>
  );
}
