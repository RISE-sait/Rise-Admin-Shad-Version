import FacilitiesPage from "@/components/locations/LocationPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllLocations } from "@/services/location";
import { StaffRoleEnum } from "@/types/user";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const locations = await getAllLocations();

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST]}>
      <div className="flex">
        <FacilitiesPage facilities={locations} />
      </div>
    </RoleProtected>
  );
}
