"use client";

import React, { useState } from "react";
import { Location } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FacilityInfoPanel from "./LocationInfoPanel";
import AddFacilityForm from "./AddLocationForm";
import { toast } from "sonner";
import RightDrawer from "@/components/reusable/RightDrawer";
import { deleteLocation } from "@/services/location";
import { useUser } from "@/contexts/UserContext";
import { revalidateLocations } from "@/actions/serverActions";
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
import { AlertModal } from "@/components/ui/AlertModal";

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const { user } = useUser();

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

  const handleDeleteFacility = async (facilityId: string) => {
    try {
      const error = await deleteLocation(facilityId, user?.Jwt!);
      if (error === null) {
        await revalidateLocations();
        toast.success("Location deleted successfully");
      } else {
        toast.error(`Error deleting location: ${error}`);
      }
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Failed to delete location");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => deleteLocation(id, user?.Jwt!))
      );
      await revalidateLocations();
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      toast.success("Selected locations deleted successfully");
    } catch (error) {
      console.error("Error deleting locations:", error);
      toast.error("Failed to delete locations");
    }
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
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setBulkDeleteOpen(true)}
              className="ml-4"
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <FacilityTable
        facilities={filteredFacilities}
        onFacilitySelect={handleFacilitySelect}
        onDeleteFacility={handleDeleteFacility}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <AlertModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={false} // Update with actual loading state if needed
      />
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[25%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details"
              ? "Facility Details"
              : "Add New Facility"}
          </h2>
          {drawerContent === "details" && selectedFacility && (
            <FacilityInfoPanel facility={selectedFacility} />
          )}
          {drawerContent === "add" && <AddFacilityForm />}
        </div>
      </RightDrawer>
    </div>
  );
}
