import MembershipsPage from "@/components/memberships/MembershipPage";
import { getAllMemberships } from "@/services/membership";

export default async function Page() {

  const memberships = await getAllMemberships()

  return (
    <div className="flex">
      <MembershipsPage memberships={memberships} />
    </div>
  );
}
