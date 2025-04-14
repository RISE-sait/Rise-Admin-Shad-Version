import MembershipsPage from "@/components/memberships/MembershipPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllMemberships } from "@/services/membership";

export default async function Page() {

  const memberships = await getAllMemberships()

  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN']}>
    <div className="flex">
      <MembershipsPage memberships={memberships} />
    </div>
    </RoleProtected>
  );
}
