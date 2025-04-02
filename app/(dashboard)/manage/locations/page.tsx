import FacilitiesPage from "@/components/facilities/LocationPage";
import { getAllLocations } from "@/services/location";

export default async function Page() {

  const locations = await getAllLocations()

  return (
    <div className="flex">
      <FacilitiesPage facilities={locations} />
    </div>
  );
}