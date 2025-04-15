"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AppointmentsPage from "@/components/Barbershop/Appointments";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";

export default function AppointmentsPageContainer() {
  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]}>
      <AppointmentsPage />
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
      
      <Skeleton className="h-10 w-32 mt-4" />
      
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      
      <Skeleton className="h-96 w-full mt-4 rounded-lg" />
    </div>
  );
}