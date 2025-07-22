"use client";

import { useEffect, useState } from "react";
import PendingStaffPage from "./PendingStaffPage";
import RoleProtected from "../RoleProtected";
import { StaffRoleEnum, User } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
import { getPendingStaffs } from "@/services/staff";
import { Skeleton } from "@/components/ui/skeleton";

export default function PendingStaffContainer() {
  const { user } = useUser();
  const jwt = user?.Jwt;
  const [staffs, setStaffs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jwt) return;
    const fetchData = async () => {
      try {
        const res = await getPendingStaffs(jwt);
        setStaffs(res);
      } catch (err) {
        console.error("Failed to fetch pending staff", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jwt]);

  const refresh = async () => {
    if (!jwt) return;
    try {
      const res = await getPendingStaffs(jwt);
      setStaffs(res);
    } catch (err) {
      console.error("Failed to refresh pending staff", err);
    }
  };

  const content = loading ? (
    <PageSkeleton />
  ) : (
    <PendingStaffPage staffs={staffs} onApproved={refresh} />
  );

  return (
    <RoleProtected
      allowedRoles={[StaffRoleEnum.ADMIN]}
      fallback={<PageSkeleton />}
    >
      {content}
    </RoleProtected>
  );
}

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
