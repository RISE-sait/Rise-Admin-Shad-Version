import FacilitiesPage from "@/components/facilities/FacilityPage";
import MembershipsPage from "@/components/memberships/MembershipPage";
import { Membership } from "@/types/membership";

export default async function () {

  const data = await fetch('http://localhost:8080/api/memberships')
  const memberships: Membership[] = await data.json()

 return <MembershipsPage memberships={memberships}/>
}
