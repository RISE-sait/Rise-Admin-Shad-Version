"use client"

import { useState, useEffect, Dispatch, SetStateAction, JSX } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "../reusable/RightDrawer";
import { Input } from "@/components/ui/input";
import ProgramTable from "./table/ProgramTable";
import ProgramInfoPanel from "./ProgramInfoPanel";
import AddProgramForm from "./AddProgramForm";
import { Program } from "@/types/program";
import { deleteProgram } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { revalidatePrograms } from "@/actions/serverActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Gamepad2 } from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";

type ProgramType = "practice" | "course" | "game" | "all";

interface ProgramPageProps {
  programs: Program[];
  programLevels: string[];
}

export default function ProgramPage({
  programs: initialPrograms,
  programLevels,
}: ProgramPageProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [activeFilter, setActiveFilter] = useState<ProgramType>("all");
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);

  const { user } = useUser();
  const { toast } = useToast();

  // Fetch programs when filter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setPrograms(initialPrograms);
      return;
    }
    const filteredPrograms = initialPrograms.filter(program => program.type === activeFilter);
    setPrograms(filteredPrograms)
  }, [activeFilter, initialPrograms, toast]);

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleDeleteProgram = async (programId: string) => {
    try {
      const error = await deleteProgram(programId, user?.Jwt!);

      if (error === null) {
        toast({ title: "Success", description: "Program deleted successfully", status: "success" });
        await revalidatePrograms();
      }
      else {
        toast({ title: "Error", description: `Error deleting program: ${error}`, variant: "destructive", status: "error" });
      }

    } catch (error) {
      console.error("Error deleting program:", error);
      toast({ title: "Error", description: "Failed to delete program", variant: "destructive", status: "error" });
    }
  };

  const filteredPractices = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (program.description &&
        program.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Counts for each program type
  const practiceCount = initialPrograms.filter(p => p.type === "practice").length;
  const courseCount = initialPrograms.filter(p => p.type === "course").length;
  const gameCount = initialPrograms.filter(p => p.type === "game").length;
  const otherCount = initialPrograms.filter(p =>
    !["practice", "course", "game"].includes(p.type || "")).length;

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your programs, courses, and classes
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
        >
          Add Program
        </Button>
      </header>

      {/* Program type filter cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="all"
          setFilter={()=> setActiveFilter('all')}
          programCount={initialPrograms.length}
          title="All Programs"
          icon={<></>}
        />
        
        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="practice"
          setFilter={()=> setActiveFilter('practice')}
          programCount={practiceCount}
          title="Practices"
          icon={<GraduationCap className="h-3.5 w-3.5 text-blue-500" />}
        />

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="course"
          setFilter={()=> setActiveFilter('course')}
          programCount={courseCount}
          title="Courses"
          icon={<BookOpen className="h-3.5 w-3.5 text-green-500" />}
        />

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="game"
          setFilter={()=> setActiveFilter('game')}
          programCount={gameCount}
          title="Games"
          icon={<Gamepad2 className="h-3.5 w-3.5 text-amber-500" />}
        />
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <p className="text-sm text-muted-foreground">
          {`${filteredPractices.length} programs found`}
        </p>
      </div>

      <ProgramTable
        program={filteredPractices}
        onProgramSelect={handleProgramSelect}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        onDeleteProgram={handleDeleteProgram}
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={"w-[50%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Program Details" : "Add Program"}
          </h2>
          {drawerContent === "details" && selectedProgram && (
            <ProgramInfoPanel program={selectedProgram} levels={programLevels} />
          )}
          {drawerContent === "add" && <AddProgramForm levels={programLevels}/>}
        </div>
      </RightDrawer>
    </div>
  );
}

function ProgramTypeCard({
  currfilter,
  targetFilter,
  setFilter,
  programCount,
  title,
  icon
}: {
  currfilter: ProgramType
  targetFilter: ProgramType
  setFilter: Dispatch<SetStateAction<ProgramType>>
  programCount: number
  title: string
  icon: JSX.Element
}
) {

  return (
    <Card
      className={`bg-muted/20 ${currfilter === targetFilter ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
      onClick={() => setFilter(currfilter)}
      role="button"
      tabIndex={0}
    >
      <CardHeader className="pb-1 pt-3 px-4">
        <div className="flex items-center gap-1.5">
          {icon}
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-4">
        <p className="text-xl font-bold">{programCount}</p>
      </CardContent>
    </Card>
  )
}