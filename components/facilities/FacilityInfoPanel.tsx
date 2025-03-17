"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Facility } from "@/types/facility";
import DetailsTab from "./infoTabs/Details";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon, BuildingIcon, Calendar } from "lucide-react";
import getValue from "@/configs/constants";
import SchedulesTab from "./infoTabs/Schedule";

export default function FacilityInfoPanel({ facility }: { facility: Facility }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [facilityDetails, setFacilityDetails] = useState({
    name: facility.name || "",
    Address: facility.Address || "",
  });
  
  const apiUrl = getValue("API");

  const handleSaveAll = async () => {
    try {
      // Save facility details
      const response = await fetch(`${apiUrl}/locations/${facility.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: facilityDetails.name,
          location: facilityDetails.Address
        })
      });

      if (!response.ok) throw new Error("Failed to save facility details");
      toast({ status: "success", description: "All changes saved successfully" });
    } catch (error) {
      toast({ status: "error", description: "Error saving changes", variant: "destructive" });
    }
  };

  const handleDeleteFacility = async () => {
    if (confirm("Are you sure you want to delete this facility? This action cannot be undone.")) {
      try {
        const response = await fetch(`${apiUrl}/locations/${facility.id}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete facility");
        toast({ status: "success", description: "Facility deleted successfully" });
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
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {facility.updated_at ? new Date(facility.updated_at).toLocaleString() : 'Never'}
          </p>
          
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