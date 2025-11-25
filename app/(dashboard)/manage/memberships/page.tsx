import MembershipsPage from "@/components/memberships/MembershipPage";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";
import { getAllMemberships } from "@/services/membership";
import CreditsPage from "@/components/credits/CreditsPage";
import { getAllCreditPackages } from "@/services/creditPackages";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const memberships = await getAllMemberships();
  const creditPackages = await getAllCreditPackages();

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST]}>
      <div className="flex flex-col">
        <MembershipsPage memberships={memberships} />
        <CreditsPage initialCreditPackages={creditPackages} />
      </div>
    </RoleProtected>
  );
}
