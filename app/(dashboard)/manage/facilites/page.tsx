import getValue from "@/components/Singleton";
import { FacilityResponseDto } from "@/app/api/Api";
import { Facility } from "@/types/facility";
import FacilitiesPage from "@/components/facilities/FacilityPage";

export default async function Page() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `/facilities`);
  const facilitiesResponse: FacilityResponseDto[] = await response.json();

  const facilities: Facility[] = facilitiesResponse.map((f) => ({
    id: f.id!,
    name: f.name!,
    Address: f.address!,
    facility_category: f.facility_category!,
  }));

  return (
    <div className="p-6 flex">
      <FacilitiesPage facilities={facilities} />
    </div>
  );
}
