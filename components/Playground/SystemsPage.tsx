"use client";
import { useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Search, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RightDrawer from "@/components/reusable/RightDrawer";
import AddSystemForm from "./AddSystemForm";
import SystemInfoPanel from "./SystemInfoPanel";
import SystemsTable from "./SystemsTable";
import { PlaygroundSystem } from "@/types/playground";

export default function SystemsPage({
  systems,
  onRefresh,
}: {
  systems: PlaygroundSystem[];
  onRefresh?: () => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [selectedSystem, setSelectedSystem] = useState<PlaygroundSystem | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSystems = searchQuery
    ? systems.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : systems;

  const handleSystemSelect = (system: PlaygroundSystem) => {
    setSelectedSystem(system);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Systems" description="Manage playground systems" />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add System
        </Button>
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search systems..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <SystemsTable
        systems={filteredSystems}
        onSystemSelect={handleSystemSelect}
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth="w-[25%]"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "System Details" : "Add System"}
          </h2>
          {drawerContent === "details" && selectedSystem && (
            <SystemInfoPanel
              system={selectedSystem}
              onClose={() => setDrawerOpen(false)}
              onChange={onRefresh}
            />
          )}
          {drawerContent === "add" && (
            <AddSystemForm
              onClose={() => setDrawerOpen(false)}
              onAdded={onRefresh}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}
