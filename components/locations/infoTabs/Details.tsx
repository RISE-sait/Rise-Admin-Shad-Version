"use client";

import { revalidateLocations } from "@/actions/serverActions";
import { LocationRequestDto } from "@/app/api/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/hooks/use-toast";
import { deleteLocation, updateLocation } from "@/services/location";
import { Location } from "@/types/location";
import { MapPinIcon, SaveIcon, TrashIcon, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { sanitizeTextInput } from "@/utils/inputValidation";

export default function DetailsTab({
  details,
  onDelete,
  onClose,
  isReceptionist = false,
}: {
  details: Location;
  onDelete?: () => void;
  onClose?: () => void;
  isReceptionist?: boolean;
}) {
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      name: details.name,
      address: details.address,
    },
  });

  const nameValue = watch("name") ?? "";
  const addressValue = watch("address") ?? "";

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
        onClose?.();
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
    try {
      const error = await deleteLocation(details.id, user?.Jwt!);

      if (error === null) {
        await revalidateLocations();

        toast({
          status: "success",
          description: "Facility deleted successfully",
        });

        if (onDelete) onDelete();
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
  };

  return (
    <div className="space-y-6">
      {/* Facility Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Facility Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Facility Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("name")}
                value={nameValue}
                onChange={(event) =>
                  setValue("name", sanitizeTextInput(event.target.value), {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                placeholder="Enter facility name"
                className="bg-background"
                disabled={isReceptionist}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                {...register("address")}
                value={addressValue}
                onChange={(event) =>
                  setValue("address", sanitizeTextInput(event.target.value), {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                placeholder="Enter facility address"
                className="bg-background"
                disabled={isReceptionist}
              />
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
                Delete Location
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this facility? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteFacility}
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
  );
}
