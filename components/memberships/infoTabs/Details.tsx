"use client";

import { revalidateMemberships } from "@/actions/serverActions";
import { MembershipRequestDto } from "@/app/api/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "@/hooks/use-toast";
import { deleteMembership, updateMembership } from "@/services/membership";
import { Membership } from "@/types/membership";
import { CreditCard, SaveIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { sanitizeTextInput } from "@/utils/inputValidation";

export default function DetailsTab({
  details,
  onClose,
}: {
  details: Membership;
  onClose: () => void;
}) {
  const { user } = useUser();

  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      name: details.name,
      description: details.description || "",
    },
  });

  const nameValue = watch("name") ?? "";
  const descriptionValue = watch("description") ?? "";

  const handleSaveInfo = async () => {
    try {
      const membershipData: MembershipRequestDto = {
        name: getValues("name"),
        description: getValues("description"),
      };

      await updateMembership(details.id, membershipData, user?.Jwt!);

      toast({
        status: "success",
        description: "Membership updated successfully",
      });
      await revalidateMemberships();
      onClose();
    } catch (error) {
      toast({
        status: "error",
        description: "Error saving changes",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMembership = async () => {
    try {
      await deleteMembership(details.id, user?.Jwt!);
      toast({
        status: "success",
        description: "Membership deleted successfully",
      });
      await revalidateMemberships();
      onClose();
    } catch (error) {
      toast({ status: "error", description: "Error deleting membership" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Membership Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Membership Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Membership Name <span className="text-red-500">*</span>
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
                placeholder="Enter membership name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                {...register("description")}
                value={descriptionValue}
                onChange={(event) =>
                  setValue("description", sanitizeTextInput(event.target.value), {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                placeholder="Describe the membership benefits and features"
                className="bg-background min-h-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-end gap-3 pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Membership
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this membership? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMembership}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          onClick={handleSaveInfo}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
        >
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
