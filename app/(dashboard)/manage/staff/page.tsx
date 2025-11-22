"use client";

import React, { useEffect, useState } from "react";
import { getAllStaffs } from "@/services/staff";
import StaffPage from "@/components/staff/StaffPage";
import PendingStaffContainer from "@/components/pending-staff/PendingStaffContainer";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum, User } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { user } = useUser();
  const [staffs, setStaffs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const data = await getAllStaffs();
        setStaffs(data);
      } catch (error) {
        console.error("Failed to fetch staffs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  if (loading) {
    return (
      <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST]}>
        <PageSkeleton />
      </RoleProtected>
    );
  }

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST]}>
      <div className="flex flex-col">
        <StaffPage staffs={staffs} />
        {!isReceptionist && <PendingStaffContainer />}
      </div>
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
