"use client";

// Admin-only page that lists all practices and provides
// a drawer interface for creating, editing and deleting practices.

import { useEffect, useState, useCallback } from "react";
import PracticesPage from "@/components/practices/PracticesPage";
import RoleProtected from "@/components/RoleProtected";
import { getSchedule } from "@/services/schedule";
import { StaffRoleEnum } from "@/types/user";
import { Practice } from "@/types/practice";
import { Skeleton } from "@/components/ui/skeleton";

export default function PracticesPageContainer() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPractices = useCallback(async () => {
    try {
      const { practices: schedulePractices } = await getSchedule();
      const mappedPractices: Practice[] = schedulePractices.map((p) => ({
        id: p.id,
        program_id: undefined,
        program_name: "",
        court_id: p.court_id,
        court_name: p.court_name ?? "",
        location_id: p.location_id,
        location_name: p.location_name ?? "",
        team_id: p.team_id,
        team_name: p.team_name,
        booked_by: p.booked_by,
        booked_by_name: p.booked_by_name ?? "",
        start_at: p.start_time,
        end_at: p.end_time ?? "",
        capacity: 0,
        status: p.status,
      }));
      setPractices(mappedPractices);
    } catch (err) {
      console.error("Failed to fetch practices", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refreshPractices();
  }, [refreshPractices]);

  const content = loading ? (
    <PageSkeleton />
  ) : (
    <PracticesPage practices={practices} onRefresh={refreshPractices} />
  );

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.COACH]}>
      <div className="flex">{content}</div>
    </RoleProtected>
  );
}

// Simple loading skeleton shown while practices are being fetched
function PageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
