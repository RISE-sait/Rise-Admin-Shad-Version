"use client"

import getValue from "@/components/Singleton";
import { LocationResponseDto } from "@/app/api/Api";
import { Facility } from "@/types/facility";
import FacilitiesPage from "@/components/facilities/FacilityPage";

export default async function Page() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `/locations`);
  const facilitiesResponse: LocationResponseDto[] = await response.json();

  const facilities: Facility[] = facilitiesResponse.map((f) => ({
    id: f.id!,
    name: f.name!,
    Address: f.address!,
  }));

  return (
    <div className="p-6 flex">
      <FacilitiesPage facilities={facilities} />
    </div>
  );
}
