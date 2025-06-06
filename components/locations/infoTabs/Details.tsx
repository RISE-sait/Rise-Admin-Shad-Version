"use client";

import { revalidateLocations } from "@/actions/serverActions";
import { LocationRequestDto } from "@/app/api/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { deleteLocation, updateLocation } from "@/services/location";
import { Location } from "@/types/location";
import { PencilIcon, MapPinIcon, SaveIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function DetailsTab({ details }: { details: Location }) {
  const { register, getValues } = useForm({
    defaultValues: {
      name: details.name,
      address: details.address,
    },
  });

  const { user } = useUser();
  const { toast } = useToast();

  const handleSaveAll = async () => {
    try {
      const locationData: LocationRequestDto = {
        ...getValues(),
      };

      const error = await updateLocation(details.id, locationData, user?.Jwt!);

      if (error === null) {
        toast({
          status: "success",
          description: "Location updated successfully",
        });
        await revalidateLocations();
      } else {
        toast({
          status: "error",
          description: `Error saving changes: ${error}`,
        });
      }
    } catch (error) {
      toast({ status: "error", description: `Error saving changes: ${error}` });
    }
  };

  const handleDeleteFacility = async () => {
    if (
      confirm(
        "Are you sure you want to delete this facility? This action cannot be undone."
      )
    ) {
      try {
        const error = await deleteLocation(details.id, user?.Jwt!);

        if (error === null) {
          await revalidateLocations();

          toast({
            status: "success",
            description: "Facility deleted successfully",
          });
        } else {
          toast({
            status: "error",
            description: `Error deleting facility: ${error}`,
          });
        }
      } catch (error) {
        console.error("Error during API request:", error);
        toast({ status: "error", description: "Error deleting facility" });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-base font-medium flex items-center gap-2">
            <PencilIcon className="h-5 w-5 text-muted-foreground" />
            Facility Name
          </label>
          <Input
            {...register("name")}
            placeholder="Enter facility name"
            className="text-lg h-12 px-4"
          />
        </div>

        <div className="space-y-3">
          <label className="text-base font-medium flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-muted-foreground" />
            Address
          </label>
          <Input
            {...register("address")}
            placeholder="Enter facility address"
            className="text-lg h-12 px-4"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <Button
          onClick={handleSaveAll}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>

        <Button
          variant="destructive"
          onClick={handleDeleteFacility}
          className="bg-red-600 hover:bg-red-700"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Location
        </Button>
      </div>
    </div>
  );
}
