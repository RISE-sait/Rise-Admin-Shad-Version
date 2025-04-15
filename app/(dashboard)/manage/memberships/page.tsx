import MembershipsPage from "@/components/memberships/MembershipPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllMemberships } from "@/services/membership";
import { StaffRoleEnum } from "@/types/user";

export default async function Page() {

  const memberships = await getAllMemberships()

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex">
        <MembershipsPage memberships={memberships} />
      </div>
    </RoleProtected>
  );
}
