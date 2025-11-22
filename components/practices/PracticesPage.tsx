"use client";

// Layout component for listing practices and opening the drawer
// to add a new practice or view/edit an existing one.

import { useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusIcon, ChevronDown } from "lucide-react";
import RightDrawer from "@/components/reusable/RightDrawer";
import PracticeTable from "./table/PracticeTable";
import PracticeInfoPanel from "./PracticeInfoPanel";
import AddPracticeForm from "./AddPracticeForm";
import { Practice } from "@/types/practice";
import { VisibilityState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { StaffRoleEnum } from "@/types/user";

export default function PracticesPage({
  practices,
  onRefresh,
}: {
  practices: Practice[];
  onRefresh: () => void;
}) {
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Filter practices client-side based on the search query
  const filteredPractices = searchQuery
    ? practices.filter((p) =>
        `${p.location_name} ${p.team_name || ""} ${p.court_name || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : practices;

  const handlePracticeSelect = (practice: Practice) => {
    setSelectedPractice(practice);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Practices" description="Manage practices" />
        {!isReceptionist && (
          <Button
            onClick={() => {
              setDrawerContent("add");
              setDrawerOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Practice
          </Button>
        )}
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search practices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((column) => (column as any).enableHiding !== false)
                .map((column) => {
                  const columnId = (column as any).id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className="capitalize"
                      checked={columnVisibility[columnId] ?? true}
                      onCheckedChange={(value) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [columnId]: value,
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
      <PracticeTable
        practices={filteredPractices}
        onPracticeSelect={handlePracticeSelect}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth="w-[75%]"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Practice Details" : "Add Practice"}
          </h2>
          {drawerContent === "details" && selectedPractice && (
            <PracticeInfoPanel
              practice={selectedPractice}
              onUpdated={onRefresh}
              onDeleted={onRefresh}
              onClose={() => setDrawerOpen(false)}
            />
          )}
          {drawerContent === "add" && (
            <AddPracticeForm
              onClose={() => setDrawerOpen(false)}
              onAdded={onRefresh}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}

const columns = PracticeTable.columns;
