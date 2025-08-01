"use client";

import React, { useState } from "react";
import { Location } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FacilityInfoPanel from "./LocationInfoPanel";
import AddFacilityForm from "./AddLocationForm";

import RightDrawer from "@/components/reusable/RightDrawer";

import FacilityTable from "./table/LocationTable";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusIcon, Search } from "lucide-react";
import columns from "./table/columns";
import { VisibilityState } from "@tanstack/react-table";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";

export default function FacilitiesPage({
  facilities,
}: {
  facilities: Location[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [selectedFacility, setSelectedFacility] = useState<Location | null>(
    null
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Filter facilities based on search query
  const filteredFacilities = searchQuery
    ? facilities.filter(
        (facility) =>
          facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (facility.address &&
            facility.address.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : facilities;

  const handleFacilitySelect = (facility: Location) => {
    setSelectedFacility(facility);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedFacility(null);
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Locations"
          description="Manage your organization's locations"
        />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Location
        </Button>
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
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
                .filter((column) => column.enableHiding !== false)
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

      <FacilityTable
        facilities={filteredFacilities}
        onFacilitySelect={handleFacilitySelect}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[25%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details"
              ? "Facility Details"
              : "Add New Facility"}
          </h2>
          {drawerContent === "details" && selectedFacility && (
            <FacilityInfoPanel
              facility={selectedFacility}
              onDelete={handleDrawerClose}
            />
          )}
          {drawerContent === "add" && <AddFacilityForm />}
        </div>
      </RightDrawer>
    </div>
  );
}
