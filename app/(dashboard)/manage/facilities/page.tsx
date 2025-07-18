import FacilitiesPage from "@/components/locations/LocationPage";
import CourtPage from "@/components/courts/CourtPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllLocations } from "@/services/location";
import { getAllCourts } from "@/services/court";
import { StaffRoleEnum } from "@/types/user";

export default async function Page() {
  const [locations, courts] = await Promise.all([
    getAllLocations(),
    getAllCourts(),
  ]);

  const courtsWithNames = courts.map((court) => ({
    ...court,
    location_name:
      locations.find((l) => l.id === court.location_id)?.name || "",
  }));

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex flex-col">
        <FacilitiesPage facilities={locations} />
        <CourtPage courts={courtsWithNames} />
      </div>
    </RoleProtected>
  );
}
