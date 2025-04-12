"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "../reusable/RightDrawer";
import { Input } from "@/components/ui/input";
import PracticeTable from "./table/PracticeTable";
import columns from "./table/columns";
import PracticeInfoPanel from "./PracticeInfoPanel";
import AddCourseForm from "./AddPracticeForm";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";
import { Practice } from "@/types/practice";
import { deleteProgram } from "@/services/practices";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { revalidatePractices } from "@/app/actions/serverActions";

interface PracticePageProps {
  practices: Practice[];
  practiceLevels: string[];
}

export default function PracticesPage({ practices, practiceLevels }: PracticePageProps) {
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { user } = useUser();

  const { toast } = useToast()

  const handlePracticeSelect = (practice: Practice) => {
    setSelectedPractice(practice);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleDeletePractice = async (practiceId: string) => {
    try {
      const error = deleteProgram(practiceId, user?.Jwt!);

      if (error === null) {
        toast({ status: "success", description: "Practice deleted successfully" });
        await revalidatePractices();
      }
      else {
        toast({ status: "error", description: `Error saving changes ${error}`, variant: "destructive" });
      }

    } catch (error) {
      console.error("Error deleting facility:", error);
      toast({ status: "error", description: "Failed to delete practice" });
    }
  };

  const filteredPractices = practices.filter(
    (practice) =>
      practice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (practice.description &&
        practice.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleColumnVisibilityChange = (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
    setColumnVisibility(prev => {
      const newState = typeof updater === "function" ? updater(prev) : updater;
      return { ...prev, ...newState };
    });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto max-w-full">
        <h1 className="text-2xl font-semibold mb-6 ">Practices</h1>
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Left side: search + columns */}
          <Input
            type="search"
            placeholder="Search practices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />

          {/* Right side: Add Course */}
          <Button
            variant="default"
            onClick={() => {
              setDrawerContent("add");
              setDrawerOpen(true);
            }}
          >
            Add Practice
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-gray-300 text-sm pl-2">{filteredPractices.length} practices found</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Columns
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns
              .filter(column => column.enableHiding !== false)
              .map((column) => {
                const columnId = (column as any).id;
                return (
                  <DropdownMenuCheckboxItem
                    key={columnId}
                    className="capitalize"
                    checked={columnVisibility[columnId] ?? true}
                    onCheckedChange={(value) =>
                      handleColumnVisibilityChange(prev => ({
                        ...prev,
                        [columnId]: value
                      }))
                    }
                  >
                    {columnId}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <PracticeTable
          practices={filteredPractices}
          onPracticeSelect={handlePracticeSelect}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onDeletePractice={handleDeletePractice}
        />
      </div>

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[50%]" : "w-[75%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Practice Details" : "Add Practice"}
          </h2>
          {drawerContent === "details" && selectedPractice && (
            <PracticeInfoPanel practice={selectedPractice} levels={practiceLevels} />
          )}
          {drawerContent === "add" && <AddCourseForm levels={practiceLevels} />}
        </div>
      </RightDrawer>
    </>
  );
}