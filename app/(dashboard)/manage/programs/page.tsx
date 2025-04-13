import ProgramPage from "@/components/programs/ProgramPage";
import { getAllProgramLevels, getAllPrograms } from "@/services/program";
import { getAllLocations } from "@/services/location";

export default async function Page() {
  // Load all programs initially
  const programs = await getAllPrograms();
  const programLevels = await getAllProgramLevels();
  const locations = await getAllLocations();

  return (
    <div className="p-6">
      <ProgramPage 
        programs={programs} 
        programLevels={programLevels} 
        locations={locations} // This should now work with the updated types
      />
    </div>
  );
}