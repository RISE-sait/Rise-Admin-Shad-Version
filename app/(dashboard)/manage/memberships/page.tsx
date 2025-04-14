import MembershipsPage from "@/components/memberships/MembershipPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllMemberships } from "@/services/membership";

export default async function Page() {

  const memberships = await getAllMemberships()

  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN']} fallback={<h1 className="text-center text-2xl">Access Denied</h1>}>
    <div className="flex">
      <MembershipsPage memberships={memberships} />
    </div>
    </RoleProtected>
  );
}
