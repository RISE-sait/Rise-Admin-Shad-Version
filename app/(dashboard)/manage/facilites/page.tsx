import FacilitiesPage from "@/components/facilities/FacilityPage";
import { Facility } from "@/types/facility";
import getValue from "@/configs/constants";

export default async function Page() {
  // Get API URL
  const apiUrl = getValue("API");

  let facilities: Facility[] = [];
  
  try {
    const response = await fetch(apiUrl + `/locations`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch facilities: ${response.status}`);
    }
    
    const facilitiesResponse = await response.json();
    
    // Map the response to the Facility type - fix the mapping here
    facilities = facilitiesResponse.map((facility: any) => ({
      id: facility.id,
      name: facility.name,
      Address: facility.address // This is likely the issue - the API returns "location", not "address"
    }));
    
  } catch (error) {
    console.error("Error fetching facilities:", error);
  }

  return (
    <div className="p-6 flex">
      <FacilitiesPage facilities={facilities} />
    </div>
  );
}