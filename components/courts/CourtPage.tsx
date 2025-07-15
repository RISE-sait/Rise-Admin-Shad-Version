// Mark this component for client-side rendering in Next.js
"use client";

import React, { useState } from "react"; // React core and state hook
import { Court } from "@/types/court"; // Type definition for Court object
import { Input } from "@/components/ui/input"; // UI input component
import { Button } from "@/components/ui/button"; // UI button component
import CourtInfoPanel from "./CourtInfoPanel"; // Panel for displaying court details
import AddCourtForm from "./AddCourtForm"; // Form component for adding a new court
import RightDrawer from "@/components/reusable/RightDrawer"; // Reusable drawer component
import CourtTable from "./table/CourtTable"; // Table component to list courts
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Dropdown menu components for filters
import { ChevronDown, PlusIcon, Search } from "lucide-react"; // Icon components
import columns from "./table/columns"; // Column definitions for the court table
import { VisibilityState } from "@tanstack/react-table"; // Type for column visibility state
import { Heading } from "@/components/ui/Heading"; // Heading component
import { Separator } from "@/components/ui/separator"; // Separator line component

// Main page component to manage courts
export default function CourtPage({ courts }: { courts: Court[] }) {
  // State for controlling whether the right drawer is open
  const [drawerOpen, setDrawerOpen] = useState(false);
  // State to track which content to show in the drawer: details view or add form
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  // State to hold the court selected for viewing/editing details
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  // State to track visibility of each column in the table
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // State for the search input value to filter courts
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courts based on search query matching name or location name
  const filteredCourts = searchQuery
    ? courts.filter(
        (court) =>
          court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (court.location_name &&
            court.location_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      )
    : courts;

  // Handler when a court row is selected: open details drawer
  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court); // Store selected court
    setDrawerContent("details"); // Switch drawer to details view
    setDrawerOpen(true); // Open the drawer
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      {/* Header with title and Add Court button */}
      <div className="flex items-center justify-between">
        <Heading title="Courts" description="Manage your courts" />
        <Button
          onClick={() => {
            setDrawerContent("add"); // Switch drawer to add form
            setDrawerOpen(true); // Open the drawer
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" /> {/* Icon for add button */}
          Add Court
        </Button>
      </div>
      <Separator /> {/* Divider line */}
      {/* Search input and filter dropdown */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courts..."
            className="pl-8"
            value={searchQuery} // Bind search input value
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Filters
                <ChevronDown className="h-4 w-4" /> {/* Icon for dropdown */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Render checkbox items for toggling column visibility */}
              {columns
                .filter((column) => column.enableHiding !== false)
                .map((column) => {
                  const columnId = (column as any).id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className="capitalize"
                      checked={columnVisibility[columnId] ?? true} // Reflect current visibility
                      onCheckedChange={(value) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [columnId]: value, // Toggle visibility state
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
      </div>
      {/* Court table with filtered data and column visibility */}
      <CourtTable
        courts={filteredCourts}
        onCourtSelect={handleCourtSelect} // Pass selection handler
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility} // Handler for visibility changes
      />
      {/* Right-side drawer for details or add form */}
      <RightDrawer
        drawerOpen={drawerOpen} // Control open state
        handleDrawerClose={() => setDrawerOpen(false)} // Close handler
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[25%]"} // Width based on content
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Court Details" : "Add Court"}
          </h2>
          {/* Conditionally render details panel or add form */}
          {drawerContent === "details" && selectedCourt && (
            <CourtInfoPanel court={selectedCourt} />
          )}
          {drawerContent === "add" && <AddCourtForm />}
        </div>
      </RightDrawer>
    </div>
  );
}
