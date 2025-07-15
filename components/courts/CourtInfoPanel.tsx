"use client"; // Ensure this component is rendered on the client side

import React, { useEffect, useState } from "react"; // React core and hooks
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Tabs UI components
import { Input } from "@/components/ui/input"; // Text input component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select/dropdown components
import { Button } from "@/components/ui/button"; // Button component
import { useToast } from "@/hooks/use-toast"; // Hook for showing toast notifications
import { useUser } from "@/contexts/UserContext"; // Hook to access current user/auth context
import { Court } from "@/types/court"; // Type for court object
import { Location } from "@/types/location"; // Type for location object
import { deleteCourt, updateCourt } from "@/services/court"; // API services for court operations
import { getAllLocations } from "@/services/location"; // API service to fetch all locations
import { CourtRequestDto } from "@/app/api/Api"; // DTO type for court create/update payload
import { revalidateCourts } from "@/actions/serverActions"; // Trigger ISR revalidation for courts
import { PencilIcon, MapPinIcon, SaveIcon, TrashIcon } from "lucide-react"; // Icon components

// Component for viewing and editing court details
export default function CourtInfoPanel({ court }: { court: Court }) {
  const { toast } = useToast(); // Toast handler for feedback messages
  const { user } = useUser(); // Authenticated user (for JWT token)
  const [name, setName] = useState(court.name); // Local state for court name input
  const [locationId, setLocationId] = useState(court.location_id); // Local state for selected location ID
  const [locations, setLocations] = useState<Location[]>([]); // State to hold fetched locations list
  const [activeTab, setActiveTab] = useState("details"); // State for active tab identifier

  // On mount, fetch all available locations for the dropdown
  useEffect(() => {
    getAllLocations()
      .then(setLocations) // Populate locations state
      .catch(() => {
        // Show error if fetching locations fails
        toast({ status: "error", description: "Failed to load locations" });
      });
  }, [toast]);

  // Save handler: update the court via API
  const handleSaveAll = async () => {
    const courtData: CourtRequestDto = { name, location_id: locationId }; // Build payload
    const error = await updateCourt(court.id, courtData, user?.Jwt!); // Call update API
    if (error === null) {
      // On success, notify and revalidate ISR
      toast({ status: "success", description: "Court updated successfully" });
      await revalidateCourts();
    } else {
      // On failure, show error message
      toast({ status: "error", description: `Error saving changes: ${error}` });
    }
  };

  // Delete handler: remove the court after confirmation
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this court?")) return; // Confirm before deleting
    const error = await deleteCourt(court.id, user?.Jwt!); // Call delete API
    if (error === null) {
      // On success, notify and revalidate ISR
      toast({ status: "success", description: "Court deleted successfully" });
      await revalidateCourts();
    } else {
      // On failure, show error message
      toast({ status: "error", description: `Error deleting court: ${error}` });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab header */}
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent hover:bg-muted/50"
            >
              <PencilIcon className="h-4 w-4" /> {/* Icon for the tab */}
              Information {/* Tab label */}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab content: Details form */}
        <TabsContent value="details" className="pt-4">
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Court Name Field */}
              <div className="space-y-3">
                <label className="text-base font-medium flex items-center gap-2">
                  <PencilIcon className="h-5 w-5 text-muted-foreground" />{" "}
                  {/* Label icon */}
                  Court Name {/* Field label */}
                </label>
                <Input
                  value={name} // Bind to local name state
                  onChange={(e) => setName(e.target.value)} // Update name state on change
                  placeholder="Enter court name"
                  className="text-lg h-12 px-4"
                />
              </div>

              {/* Location Select Field */}
              <div className="space-y-3">
                <label className="text-base font-medium flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-muted-foreground" />{" "}
                  {/* Label icon */}
                  Location {/* Field label */}
                </label>
                <Select
                  value={locationId} // Bind to local locationId state
                  onValueChange={setLocationId} // Update locationId on select
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />{" "}
                    {/* Placeholder text */}
                  </SelectTrigger>
                  <SelectContent>
                    {/* Render each location as a selectable item */}
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <Button
                onClick={handleSaveAll} // Trigger save handler
                className="bg-green-600 hover:bg-green-700"
              >
                <SaveIcon className="h-4 w-4 mr-2" /> {/* Save icon */}
                Save Changes {/* Button label */}
              </Button>
              <Button
                variant="destructive" // Destructive style
                onClick={handleDelete} // Trigger delete handler
                className="bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" /> {/* Delete icon */}
                Delete Court {/* Button label */}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
