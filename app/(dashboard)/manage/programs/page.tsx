import ProgramPage from "@/components/programs/ProgramPage";
import RoleProtected from "@/components/RoleProtected";
import { getAllProgramLevels, getAllPrograms } from "@/services/program";

export default async function Page() {

  const [programs, programLevels] = await Promise.all([
    getAllPrograms(),
    getAllProgramLevels(),
  ]);

  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN']} fallback={<h1 className="text-center text-2xl">Access Denied</h1>}>
    <div className="p-6">
      <ProgramPage
        programs={programs}
        programLevels={programLevels}
      />
    </div>
    </RoleProtected>
  );
}