"use client";

import React, { useState } from "react";
import FacilityTable from "./FacilityTable";
import { Location } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import FacilityInfoPanel from "./FacilityInfoPanel";
import AddFacilityForm from "./AddFacilityForm";
import { toast } from "sonner";
import RightDrawer from "@/components/reusable/RightDrawer";
import { revalidateLocations } from "@/app/actions/serverActions";
import { deleteLocation } from "@/services/location";
import { useUser } from "@/contexts/UserContext";

export default function FacilitiesPage({ facilities }: { facilities: Location[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add">("details");
  const [selectedFacility, setSelectedFacility] = useState<Location | null>(null);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user } = useUser();

  // Filter facilities based on search query
  const filteredFacilities = searchQuery 
    ? facilities.filter(facility => 
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (facility.Address && facility.Address.toLowerCase().includes(searchQuery.toLowerCase()))
        // Changed from lowercase address to uppercase Address
      )
    : facilities;

  const handleFacilitySelect = (facility: Location) => {
    setSelectedFacility(facility);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleDeleteFacility = async (facilityId: string) => {
    try {
      await deleteLocation(facilityId, user?.Jwt!); 

      toast.success("Facility deleted successfully");
      // Remove the deleted facility from the list
      await revalidateLocations();
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Failed to delete facility");
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
          <p className="text-muted-foreground">
            Manage your organization's locations
          </p>
        </div>
        <Button 
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <FacilityTable
        facilities={filteredFacilities}
        onFacilitySelect={handleFacilitySelect}
        onDeleteFacility={handleDeleteFacility}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[65%]" : "w-[35%] max-w-[450px]"}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Facility Details" : "Add New Facility"}
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