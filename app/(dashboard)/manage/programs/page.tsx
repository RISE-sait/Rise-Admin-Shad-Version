import ProgramPage from "@/components/programs/ProgramPage";
import { getAllProgramLevels, getAllPrograms } from "@/services/program";

export default async function Page() {
  // Load all programs initially
  const programs = await getAllPrograms();
  const programLevels = await getAllProgramLevels();

  return (
    <div className="p-6">
      <ProgramPage practices={programs} practiceLevels={programLevels}/>
    </div>
  );
}