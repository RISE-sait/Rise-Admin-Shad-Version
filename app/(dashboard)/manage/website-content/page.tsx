import RoleProtected from "@/components/RoleProtected";
import WebsiteContentPage from "@/components/website-content/WebsiteContentPage";
import { StaffRoleEnum } from "@/types/user";

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.SUPERADMIN]}>
      <div className="flex">
        <WebsiteContentPage />
      </div>
    </RoleProtected>
  );
}
