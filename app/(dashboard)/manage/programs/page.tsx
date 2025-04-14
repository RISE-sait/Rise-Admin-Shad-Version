"use client"

import ProgramPage from "@/components/programs/ProgramPage";
import { getAllProgramLevels, getAllPrograms } from "@/services/program";
import { getAllLocations } from "@/services/location";
import { useEffect, useState } from "react";
import { Program } from "@/types/program";
import { Location } from "@/types/location";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programLevels, setProgramLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {

    try {
    (async() => {
      const [fetchedPrograms, fetchedProgramLevels, fetchedLocations] = await Promise.all([
        getAllPrograms(),
        getAllProgramLevels(),
        getAllLocations()
      ]);

      setPrograms(fetchedPrograms);
      setProgramLevels(fetchedProgramLevels);
      setLocations(fetchedLocations);
    })()
  }
  catch (error) {
      console.error("Error fetching data:", error);
      toast({
        description: `Failed to load programs: ${error}`,
        status: "error"
      });
    }

  }, []);

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