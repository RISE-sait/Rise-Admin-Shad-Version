"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RightDrawer from "../reusable/RightDrawer";
import { Input } from "@/components/ui/input";
import PracticeTable, { columns } from "./PracticeTable";
import CourseInfoPanel from "./CourseInfoPanel";
import AddCourseForm from "./AddCourseForm";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";
import { Practice } from "@/types/practice";

export default function CoursesPage({ practices }: { practices: Practice[] }) {
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const handleCourseSelect = (practice: Practice) => {
    setSelectedPractice(practice);
    setDrawerContent("details");
    setDrawerOpen(true);
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
        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder="Search practices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Columns
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter(column => (column as any).enableHiding !== false)
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

        <PracticeTable
          practices={filteredPractices}
          onPracticeSelect={handleCourseSelect}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
        />
      </div>

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[75%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Course Details" : "Add Course"}
          </h2>
          {drawerContent === "details" && selectedPractice && (
            <CourseInfoPanel course={selectedPractice} />
          )}
          {drawerContent === "add" && <AddCourseForm />}
        </div>
      </RightDrawer>
    </>
  );
}