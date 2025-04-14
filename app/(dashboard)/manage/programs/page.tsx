import ProgramPage from "@/components/programs/ProgramPage";
import { getAllProgramLevels, getAllPrograms } from "@/services/program";

export default async function Page() {

  const [programs, programLevels] = await Promise.all([
    getAllPrograms(),
    getAllProgramLevels(),
  ]);

  return (
    <div className="p-6">
      <ProgramPage
        programs={programs}
        programLevels={programLevels}
      />
    </div>
  );
}