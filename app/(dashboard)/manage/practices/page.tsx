"use client";

// Admin-only page that lists all practices and provides
// a drawer interface for creating, editing and deleting practices.

import { useEffect, useState } from "react";
import PracticesPage from "@/components/practices/PracticesPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllPractices } from "@/services/practices";
import { StaffRoleEnum } from "@/types/user";
import { Practice } from "@/types/practice";
import { Skeleton } from "@/components/ui/skeleton";

export default function PracticesPageContainer() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllPractices();
        setPractices(res);
      } catch (err) {
        console.error("Failed to fetch practices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const content = loading ? (
    <PageSkeleton />
  ) : (
    <PracticesPage practices={practices} />
  );

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
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
