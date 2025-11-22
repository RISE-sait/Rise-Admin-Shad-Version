import ManageBarberAvailability from "@/components/Barbershop/ManageBarberAvailability";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageBarberAvailabilityPage() {
  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]} fallback={<PageSkeleton />}>
      <ManageBarberAvailability />
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
