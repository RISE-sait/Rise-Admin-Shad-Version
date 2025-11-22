"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@/contexts/UserContext";
import { Court } from "@/types/court";
import { Location } from "@/types/location";
import { deleteCourt, updateCourt } from "@/services/court";
import { getAllLocations } from "@/services/location";
import { CourtRequestDto } from "@/app/api/Api";
import { revalidateCourts } from "@/actions/serverActions";
import { Grid3x3, MapPinIcon, SaveIcon, TrashIcon, FileText } from "lucide-react";
import { sanitizeTextInput } from "@/utils/inputValidation";
import { StaffRoleEnum } from "@/types/user";

interface CourtInfoPanelProps {
  court: Court;
  onClose?: () => void;
}

export default function CourtInfoPanel({
  court,
  onClose,
}: CourtInfoPanelProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;
  const [name, setName] = useState(court.name);
  const [locationId, setLocationId] = useState(court.location_id);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    getAllLocations()
      .then(setLocations)
      .catch(() => {
        toast({ status: "error", description: "Failed to load locations" });
      });
  }, [toast]);

  const handleSaveAll = async () => {
    const courtData: CourtRequestDto = { name, location_id: locationId };
    const error = await updateCourt(court.id, courtData, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Court updated successfully" });
      await revalidateCourts();
      onClose?.();
    } else {
      toast({ status: "error", description: `Error saving changes: ${error}` });
    }
  };

  const handleDelete = async () => {
    const error = await deleteCourt(court.id, user?.Jwt!);
    if (error === null) {
      toast({ status: "success", description: "Court deleted successfully" });
      await revalidateCourts();
      if (onClose) onClose();
    } else {
      toast({ status: "error", description: `Error deleting court: ${error}` });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <FileText className="h-4 w-4" />
              Information
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="pt-4">
          <div className="space-y-6">
            {/* Court Information Section */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Grid3x3 className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-lg">Court Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Court Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(sanitizeTextInput(e.target.value))}
                      placeholder="Enter court name"
                      className="bg-background"
                      disabled={isReceptionist}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Select value={locationId} onValueChange={setLocationId} disabled={isReceptionist}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {!isReceptionist && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Court
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this court? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  onClick={handleSaveAll}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
