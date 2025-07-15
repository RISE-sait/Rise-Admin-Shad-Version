import CourtPage from "@/components/courts/CourtPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllCourts } from "@/services/court";
import { getAllLocations } from "@/services/location";
import { StaffRoleEnum } from "@/types/user";

export default async function Page() {
  const [courts, locations] = await Promise.all([
    getAllCourts(),
    getAllLocations(),
  ]);

  const courtsWithNames = courts.map((court) => ({
    ...court,
    location_name:
      locations.find((l) => l.id === court.location_id)?.name || "",
  }));

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex">
        <CourtPage courts={courtsWithNames} />
      </div>
    </RoleProtected>
  );
}
