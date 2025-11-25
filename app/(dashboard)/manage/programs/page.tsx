import ProgramPage from "@/components/programs/ProgramPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllPrograms } from "@/services/program";
import { StaffRoleEnum } from "@/types/user";

export const dynamic = 'force-dynamic';

export default async function Page() {

  const programs = await getAllPrograms();

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST]}>
      <div className="p-6">
        <ProgramPage programs={programs} />
      </div>
    </RoleProtected>
  );
}