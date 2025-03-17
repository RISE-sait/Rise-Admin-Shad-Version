"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Location } from "@/types/location";
import DetailsTab from "./infoTabs/Details";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon, BuildingIcon } from "lucide-react";
import SchedulesTab from "./infoTabs/Schedule";
import { deleteLocation, updateLocation } from "@/services/location";
import { LocationRequestDto } from "@/app/api/Api";
import { useUser } from "@/contexts/UserContext";
import { revalidateLocations } from "@/app/actions/serverActions";

export default function FacilityInfoPanel({ facility }: { facility: Location }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [facilityDetails, setFacilityDetails] = useState({
    name: facility.name || "",
    Address: facility.Address || "",
  });

  const { user } = useUser();

  const handleSaveAll = async () => {
    try {

      const locationData: LocationRequestDto = {
        address: facilityDetails.Address,
        name: facilityDetails.name
      }

      await updateLocation(facility.id, locationData, user?.Jwt!);
      toast({ status: "success", description: "Facility updated successfully" });
      
      await revalidateLocations();
    } catch (error) {
      console.error("Error during API request:", error);
      toast({ status: "error", description: "An error occurred. Please try again." });
    }
  };

  const handleDeleteFacility = async () => {
    if (confirm("Are you sure you want to delete this facility? This action cannot be undone.")) {
      try {
        const response = await deleteLocation(facility.id, user?.Jwt!);

        if (!response.ok) throw new Error("Failed to delete facility");
        toast({ status: "success", description: "Facility deleted successfully" });

      await revalidateLocations();
      } catch (error) {
        toast({ status: "error", description: "Error deleting facility", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <BuildingIcon className="h-4 w-4" />
              Information
            </TabsTrigger>
            {/* <TabsTrigger 
              value="schedule"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="details" className="pt-4">
          <DetailsTab
            details={facilityDetails}
            onDetailsChange={setFacilityDetails}
          />
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <SchedulesTab facilityId={facility.id} />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex justify-end items-center">
          {/* <p className="text-sm text-muted-foreground">
            Last updated: {facility ? new Date(facility.updated_at).toLocaleString() : 'Never'}
          </p> */}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleDeleteFacility}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>

            <Button
              onClick={handleSaveAll}
              className="bg-green-600 hover:bg-green-700"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}