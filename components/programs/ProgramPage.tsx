"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "../reusable/RightDrawer";
import { Input } from "@/components/ui/input";
import ProgramTable from "./table/ProgramTable";
import ProgramInfoPanel from "./ProgramInfoPanel";
import AddProgramForm from "./AddProgramForm";
import { Program } from "@/types/program";
import { deleteProgram, getAllPrograms } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { revalidatePractices } from "@/app/actions/serverActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Gamepad2, Box } from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";
import { Location } from "@/types/location";

type ProgramType = "practice" | "course" | "game" | "all";

interface ProgramPageProps {
  programs: Program[];
  programLevels: string[];
  locations: Location[]; // Add this line
}

export default function ProgramPage({ 
  programs: initialPractices, 
  programLevels: practiceLevels,
  locations 
}: ProgramPageProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [activeFilter, setActiveFilter] = useState<ProgramType>("all");
  const [programs, setPrograms] = useState<Program[]>(initialPractices);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();
  const { toast } = useToast();

  // Fetch programs when filter changes
  useEffect(() => {
    async function fetchProgramsByType() {
      if (activeFilter === "all") {
        setPrograms(initialPractices);
        return;
      }
      
      setIsLoading(true);
      try {
        const filteredPrograms = await getAllPrograms(activeFilter);
        setPrograms(filteredPrograms);
      } catch (error) {
        console.error("Error fetching programs:", error);
        toast({ 
          title: "Error", 
          description: "Failed to load programs",
          variant: "destructive",
          status: "error" // Add this line
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProgramsByType();
  }, [activeFilter, initialPractices, toast]);

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
        await revalidatePractices();
        // Remove from current list for immediate UI update
        setPrograms(programs.filter(p => p.id !== programId));
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
  const practiceCount = initialPractices.filter(p => p.type === "practice").length;
  const courseCount = initialPractices.filter(p => p.type === "course").length;
  const gameCount = initialPractices.filter(p => p.type === "game").length;
  const otherCount = initialPractices.filter(p => 
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
        <Card
          className={`bg-muted/20 ${activeFilter === "all" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("all")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-base font-medium">All Programs</CardTitle>
            <CardDescription className="text-xs">View all types</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{initialPractices.length}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeFilter === "practice" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("practice")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
              <CardTitle className="text-base font-medium">Practice</CardTitle>
            </div>
            <CardDescription className="text-xs">Training sessions</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{practiceCount}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeFilter === "course" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("course")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-green-500" />
              <CardTitle className="text-base font-medium">Course</CardTitle>
            </div>
            <CardDescription className="text-xs">Educational programs</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{courseCount}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeFilter === "game" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveFilter("game")}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5 text-amber-500" />
              <CardTitle className="text-base font-medium">Game</CardTitle>
            </div>
            <CardDescription className="text-xs">Game events</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{gameCount}</p>
          </CardContent>
        </Card>
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
          {isLoading ? "Loading programs..." : `${filteredPractices.length} programs found`}
        </p>
      </div>

      <ProgramTable
        practices={filteredPractices}
        onPracticeSelect={handleProgramSelect}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        onDeletePractice={handleDeleteProgram}
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[50%]" : "w-[75%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Program Details" : "Add Program"}
          </h2>
          {drawerContent === "details" && selectedProgram && (
            <ProgramInfoPanel practice={selectedProgram} levels={practiceLevels} />
          )}
          {drawerContent === "add" && <AddProgramForm levels={practiceLevels} initialLocations={locations} />}
        </div>
      </RightDrawer>
    </div>
  );
}