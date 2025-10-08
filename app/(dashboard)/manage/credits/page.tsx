import RoleProtected from "@/components/RoleProtected";
import CreditsPage from "@/components/credits/CreditsPage";
import { StaffRoleEnum } from "@/types/user";
import { getAllCreditPackages } from "@/services/creditPackages";

export default async function Page() {
  const creditPackages = await getAllCreditPackages();

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex">
        <CreditsPage initialCreditPackages={creditPackages} />
      </div>
    </RoleProtected>
  );
}
