"use client";

import { useState, useEffect, Dispatch, SetStateAction, JSX } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "../reusable/RightDrawer";
import { Input } from "@/components/ui/input";
import ProgramTable from "./table/ProgramTable";
import ProgramInfoPanel from "./ProgramInfoPanel";
import AddProgramForm from "./AddProgramForm";
import { Program } from "@/types/program";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Gamepad2,
  Trophy,
  CalendarDays,
} from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";
import {
  PROGRAM_TEXT_INPUT_MESSAGE,
  PROGRAM_TEXT_INPUT_PATTERN,
  sanitizeProgramText,
} from "@/lib/programValidation";
import { useUser } from "@/contexts/UserContext";
import { StaffRoleEnum } from "@/types/user";

type ProgramType =
  | "course"
  | "tournament"
  | "tryouts"
  | "event"
  | "other"
  | "all";

interface ProgramPageProps {
  programs: Program[];
}

export default function ProgramPage({
  programs: initialPrograms,
}: ProgramPageProps) {
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [activeFilter, setActiveFilter] = useState<ProgramType>("all");
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);

  // Fetch programs when filter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setPrograms(initialPrograms);
      return;
    }
    const filteredPrograms = initialPrograms.filter(
      (program) => program.type === activeFilter
    );
    setPrograms(filteredPrograms);
  }, [activeFilter, initialPrograms]);

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const filteredPractices = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (program.description &&
        program.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Counts for each program type
  const courseCount = initialPrograms.filter((p) => p.type === "course").length;
  const tournamentCount = initialPrograms.filter(
    (p) => p.type === "tournament"
  ).length;
  const tryoutsCount = initialPrograms.filter(
    (p) => p.type === "tryouts"
  ).length;
  const eventCount = initialPrograms.filter((p) => p.type === "event").length;
  const otherCount = initialPrograms.filter((p) => p.type === "other").length;

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your programs, courses, and classes
          </p>
        </div>

        {!isReceptionist && (
          <Button
            variant="default"
            onClick={() => {
              setDrawerContent("add");
              setDrawerOpen(true);
            }}
          >
            Add Program
          </Button>
        )}
      </header>

      {/* Program type filter cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="all"
          setFilter={() => setActiveFilter("all")}
          programCount={initialPrograms.length}
          title="All Programs"
          icon={<></>}
        />

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="course"
          setFilter={() => setActiveFilter("course")}
          programCount={courseCount}
          title="Courses"
          icon={<BookOpen className="h-3.5 w-3.5 text-green-500" />}
        />

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="tournament"
          setFilter={() => setActiveFilter("tournament")}
          programCount={tournamentCount}
          title="Tournaments"
          icon={<Trophy className="h-3.5 w-3.5 text-blue-500" />}
        />

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="tryouts"
          setFilter={() => setActiveFilter("tryouts")}
          programCount={tryoutsCount}
          title="Tryouts"
          icon={<GraduationCap className="h-3.5 w-3.5 text-amber-500" />}
        />

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="event"
          setFilter={() => setActiveFilter("event")}
          programCount={eventCount}
          title="Events"
          icon={<CalendarDays className="h-3.5 w-3.5 text-indigo-500" />}
        />

        <ProgramTypeCard
          currfilter={activeFilter}
          targetFilter="other"
          setFilter={() => setActiveFilter("other")}
          programCount={otherCount}
          title="Other"
          icon={<Gamepad2 className="h-3.5 w-3.5 text-purple-500" />}
        />
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search programs..."
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(sanitizeProgramText(event.target.value))
          }
          className="max-w-xs"
          pattern={PROGRAM_TEXT_INPUT_PATTERN}
          title={PROGRAM_TEXT_INPUT_MESSAGE}
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
            <ProgramInfoPanel
              program={selectedProgram}
              onClose={() => setDrawerOpen(false)}
              isReceptionist={isReceptionist}
            />
          )}
          {drawerContent === "add" && (
            <AddProgramForm
              onSuccess={() => setDrawerOpen(false)}
            />
          )}
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
  icon,
}: {
  currfilter: ProgramType;
  targetFilter: ProgramType;
  setFilter: Dispatch<SetStateAction<ProgramType>>;
  programCount: number;
  title: string;
  icon: JSX.Element;
}) {
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
  );
}
