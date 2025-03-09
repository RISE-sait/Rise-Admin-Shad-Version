import MembershipsPage from "@/components/memberships/MembershipPage";
import { Course } from "@/types/course";
import getValue from "@/components/Singleton";
import { MembershipResponse } from "@/app/api/Api";
import { Membership } from "@/types/membership";

export default async function Page() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `/memberships`);
  const membershipResponse: MembershipResponse[] = await response.json();

  const memberships: Membership[] = membershipResponse.map((m) => ({
    id: m.id!,
    name: m.name!,
    description: m.description!,
    created_at: m.created_at!,
    updated_at: m.updated_at!,
  }));

  return (
    <div className="p-6 flex">
      <MembershipsPage memberships={memberships} />
    </div>
  );
}
