import ProgramPage from "@/components/programs/ProgramPage";
import { getAllProgramLevels, getAllPrograms } from "@/services/program";
import { getAllLocations } from "@/services/location";

export default async function Page() {

  const [programs, programLevels, locations] = await Promise.all([
    getAllPrograms(),
    getAllProgramLevels(),
    getAllLocations()
  ]);

  return (
    <div className="p-6">
      <ProgramPage
        programs={programs}
        programLevels={programLevels}
        locations={locations}
      />
    </div>
  );
}