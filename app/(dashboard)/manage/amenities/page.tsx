"use client";

import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BarbershopPage from "@/components/Barbershop/BarberPage";
import PlaygroundPage from "@/components/Playground/PlaygroundPage";
import SystemsPage from "@/components/Playground/SystemsPage";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum, User } from "@/types/user";
import { PlaygroundSession, PlaygroundSystem } from "@/types/playground";
import { getAllStaffs } from "@/services/staff";
import {
  getPlaygroundSessions,
  getPlaygroundSystems,
} from "@/services/playground";

export default function AmenitiesPageContainer() {
  const [staffs, setStaffs] = useState<User[]>([]);
  const [sessions, setSessions] = useState<PlaygroundSession[]>([]);
  const [systems, setSystems] = useState<PlaygroundSystem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSystems = useCallback(async () => {
    try {
      const res = await getPlaygroundSystems();
      setSystems(res);
    } catch (err) {
      console.error("Failed to fetch systems", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, sessionRes, systemRes] = await Promise.all([
          getAllStaffs(StaffRoleEnum.BARBER.toUpperCase()),
          getPlaygroundSessions(),
          getPlaygroundSystems(),
        ]);
        setStaffs(staffRes);
        setSessions(sessionRes);
        setSystems(systemRes);
      } catch (err) {
        console.error("Failed to fetch amenities data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const content = loading ? (
    <PageSkeleton />
  ) : (
    <div className="flex flex-col">
      <BarbershopPage staffs={staffs} />
      <PlaygroundPage sessions={sessions} systems={systems} />
      <SystemsPage systems={systems} onRefresh={fetchSystems} />
    </div>
  );

  return (
    <RoleProtected
      allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER, StaffRoleEnum.RECEPTIONIST]}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-36" />
        ))}
      </div>

      <Skeleton className="h-96 w-full mt-8 rounded-lg" />
    </div>
  );
}
