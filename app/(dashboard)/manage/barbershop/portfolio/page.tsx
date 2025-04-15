"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PortfolioPage from "@/components/Barbershop/Portfolio";
import RoleProtected from "@/components/RoleProtected";

export default function PortfolioPageContainer() {
  return (
    <RoleProtected allowedRoles={["ADMIN", "SUPERADMIN", "BARBER"]}>
      <Suspense fallback={<PageSkeleton />}>
        <PortfolioPage />
      </Suspense>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}