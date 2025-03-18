import FacilitiesPage from "@/components/facilities/FacilityPage";
import { getAllLocations } from "@/services/location";

export default async function Page() {

  const locations = await getAllLocations()

  return (
    <div className="p-6 flex">
      <FacilitiesPage facilities={locations} />
    </div>
  );
}