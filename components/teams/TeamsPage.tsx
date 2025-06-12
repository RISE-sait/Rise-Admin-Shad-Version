"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import RightDrawer from "@/components/reusable/RightDrawer";
import TeamTable from "./table/TeamTable";
import TeamInfoPanel from "./TeamInfoPanel";
import AddTeamForm from "./AddTeamForm";
import { Team } from "@/types/team";
import { VisibilityState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function TeamsPage({ teams }: { teams: Team[] }) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const filteredTeams = searchQuery
    ? teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : teams;

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Teams" description="Manage your teams" />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Team
        </Button>
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="border rounded-md px-3 py-2 text-sm flex gap-2 items-center">
                Filters
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((column: any) => (column as any).enableHiding !== false)
                .map((column: any) => {
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

      <TeamTable
        teams={filteredTeams}
        onTeamSelect={handleTeamSelect}
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
            {drawerContent === "details" ? "Team Details" : "Add Team"}
          </h2>
          {drawerContent === "details" && selectedTeam && (
            <TeamInfoPanel
              team={selectedTeam}
              onClose={() => setDrawerOpen(false)}
            />
          )}
          {drawerContent === "add" && (
            <AddTeamForm onClose={() => setDrawerOpen(false)} />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}

const columns = TeamTable.columns;
