import FacilitiesPage from "@/components/locations/LocationPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllLocations } from "@/services/location";
import { StaffRoleEnum } from "@/types/user";

export default async function Page() {
  const locations = await getAllLocations();

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex">
        <FacilitiesPage facilities={locations} />
      </div>
    </RoleProtected>
  );
}
