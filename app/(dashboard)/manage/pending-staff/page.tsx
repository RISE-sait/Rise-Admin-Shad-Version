"use client";

// React hooks
import { useEffect, useState } from "react";
// Page component and protection
import PendingStaffPage from "@/components/pending-staff/PendingStaffPage";
import RoleProtected from "@/components/RoleProtected";
// Types and context
import { StaffRoleEnum, User } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
// API service and UI
import { getPendingStaffs } from "@/services/staff";
import { Skeleton } from "@/components/ui/skeleton";

// Container component for pending staff page
export default function PendingStaffPageContainer() {
  const { user } = useUser(); // Get current user from context
  const jwt = user?.Jwt; // Extract JWT token if present
  // State for list of pending staff and loading flag
  const [staffs, setStaffs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending staff on mount or when JWT changes
  useEffect(() => {
    if (!jwt) return; // Do nothing if no token
    const fetchData = async () => {
      try {
        const res = await getPendingStaffs(jwt); // Call API
        setStaffs(res); // Update state
      } catch (err) {
        console.error("Failed to fetch pending staff", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchData();
  }, [jwt]);

  // Function to refresh the staff list on demand
  const refresh = async () => {
    if (!jwt) return;
    try {
      const res = await getPendingStaffs(jwt);
      setStaffs(res);
    } catch (err) {
      console.error("Failed to refresh pending staff", err);
    }
  };

  // Decide what to render: skeleton during load, page when ready
  const content = loading ? (
    <PageSkeleton />
  ) : (
    <PendingStaffPage staffs={staffs} onApproved={refresh} />
  );

  return (
    <RoleProtected
      allowedRoles={[StaffRoleEnum.ADMIN]} // Only admins allowed
      fallback={<PageSkeleton />} // Show skeleton if not authorized
    >
      {content}
    </RoleProtected>
  );
}

// Skeleton placeholder while data loads
function PageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" /> {/* Title skeleton */}
          <Skeleton className="h-4 w-48 mt-2" />
          {/* Subtitle skeleton */}
        </div>
        <Skeleton className="h-10 w-32" /> {/* Button skeleton */}
      </div>
      <Skeleton className="h-px w-full" /> {/* Divider */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" /> // Row skeletons
        ))}
      </div>
    </div>
  );
}
