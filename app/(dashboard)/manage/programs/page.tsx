import ProgramPage from "@/components/programs/ProgramPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllProgramLevels, getAllPrograms } from "@/services/program";
import { StaffRoleEnum } from "@/types/user";

export const dynamic = 'force-dynamic';

export default async function Page() {

  const [programs, programLevels] = await Promise.all([
    getAllPrograms(),
    getAllProgramLevels(),
  ]);

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST]}>
      <div className="p-6">
        <ProgramPage
          programs={programs}
          programLevels={programLevels}
        />
      </div>
    </RoleProtected>
  );
}