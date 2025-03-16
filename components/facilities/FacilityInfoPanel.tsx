"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Facility } from "@/types/facility";
import DetailsTab from "./infoTabs/Details";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon } from "lucide-react";
import getValue from "@/components/Singleton";

export default function FacilityInfoPanel({ facility }: { facility: Facility }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [facilityDetails, setFacilityDetails] = useState({
    name: facility.name || "",
    Address: facility.Address || "",  // Changed back to uppercase 'A' to match interface
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
          location: facilityDetails.Address // Use uppercase 'A' here to match our state
        })
      });

      if (!response.ok) throw new Error("Failed to save facility details");
      toast({ status: "success", description: "All changes saved successfully" });
    } catch (error) {
      toast({ status: "error", description: "Error saving changes", variant: "destructive" });
    }
  };

  const handleDeleteFacility = async () => {
    try {
      const response = await fetch(`${apiUrl}/locations/${facility.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete facility");
      toast({ status: "success", description: "Facility deleted successfully" });
    } catch (error) {
      toast({ status: "error", description: "Error deleting facility", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-muted/50">
          <TabsTrigger value="details">Facility Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <DetailsTab
            details={facilityDetails}
            onDetailsChange={setFacilityDetails}
          />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center gap-4">
          <Button
            variant="destructive"
            onClick={handleDeleteFacility}
            className="gap-2 flex-shrink-0"
          >
            <TrashIcon className="h-4 w-4" />
            Delete Facility
          </Button>
          
          <Button
            onClick={handleSaveAll}
            className="gap-2 bg-green-600 hover:bg-green-700 flex-shrink-0"
          >
            <SaveIcon className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}