import FacilitiesPage from "@/components/facilities/FacilityPage";
import { Facility } from "@/types/facility";

export default async function () {

  const data = await fetch('http://localhost:8080/api/facilities')
  const facilities: Facility[] = await data.json()

  return <FacilitiesPage facilities={facilities} />
}
