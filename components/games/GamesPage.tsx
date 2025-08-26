"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusIcon, ChevronDown } from "lucide-react";
import RightDrawer from "@/components/reusable/RightDrawer";
import GameTable from "./table/GameTable";
import GameInfoPanel from "./GameInfoPanel";
import AddGameForm from "./AddGameForm";
import { Game } from "@/types/games";
import { VisibilityState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export default function GamesPage({
  games,
  refreshGames,
}: {
  games: Game[];
  refreshGames: () => Promise<void>;
}) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const filteredGames = searchQuery
    ? games.filter((g) =>
        `${g.home_team_name} ${g.away_team_name} ${g.location_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : games;

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Games" description="Manage games" />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Game
        </Button>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games..."
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
      <GameTable
        games={filteredGames}
        onGameSelect={handleGameSelect}
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
            {drawerContent === "details" ? "Game Details" : "Add Game"}
          </h2>
          {drawerContent === "details" && selectedGame && (
            <GameInfoPanel
              game={selectedGame}
              onClose={() => setDrawerOpen(false)}
              refreshGames={refreshGames}
            />
          )}
          {drawerContent === "add" && (
            <AddGameForm
              onClose={() => setDrawerOpen(false)}
              refreshGames={refreshGames}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}

const columns = GameTable.columns;
