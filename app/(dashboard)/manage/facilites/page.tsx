import FacilitiesPage from "@/components/facilities/FacilityPage";
import { Facility } from "@/types/facility";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const facilityName = (await searchParams).name

  const data = await fetch(`http://localhost:8080/api/facilities?name=${facilityName ?? ''}`)
  const facilities: Facility[] = await data.json()

  return <FacilitiesPage facilities={facilities} />
}
