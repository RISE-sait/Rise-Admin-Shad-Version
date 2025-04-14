import FacilitiesPage from "@/components/locations/LocationPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllLocations } from "@/services/location";

export default async function Page() {

  const locations = await getAllLocations()

  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN']}>
    <div className="flex">
      <FacilitiesPage facilities={locations} />
    </div>
    </RoleProtected>
  );
}