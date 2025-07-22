import { Skeleton } from "@/components/ui/skeleton";
import BarbershopPage from "@/components/Barbershop/BarberPage";
import PlaygroundPage from "@/components/Playground/PlaygroundPage";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";
import { getAllStaffs } from "@/services/staff";
import {
  getPlaygroundSessions,
  getPlaygroundSystems,
} from "@/services/playground";

export default async function AmenitiesPageContainer() {
  const [staffs, sessions, systems] = await Promise.all([
    getAllStaffs(StaffRoleEnum.BARBER.toUpperCase()),
    getPlaygroundSessions(),
    getPlaygroundSystems(),
  ]);

  return (
    <RoleProtected
      allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]}
      fallback={<PageSkeleton />}
    >
      <div className="flex flex-col">
        <BarbershopPage staffs={staffs} />
        <PlaygroundPage sessions={sessions} systems={systems} />
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
