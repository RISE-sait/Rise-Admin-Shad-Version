import FacilitiesPage from "@/components/locations/LocationPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllLocations } from "@/services/location";

export default async function Page() {

  const locations = await getAllLocations()

  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN']} fallback={<h1 className="text-center text-2xl">Access Denied</h1>}>
    <div className="flex">
      <FacilitiesPage facilities={locations} />
    </div>
    </RoleProtected>
  );
}