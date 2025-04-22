"use client"

import { revalidateMemberships } from "@/actions/serverActions";
import { MembershipRequestDto } from "@/app/api/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { deleteMembership, updateMembership } from "@/services/membership";
import { Membership } from "@/types/membership";
import { PencilIcon, SaveIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function DetailsTab({
  details,
}: {
  details: Membership;
}) {

  const { user } = useUser();

  const { register, getValues } = useForm({
    defaultValues: {
      name: details.name,
      description: details.description || "",
    }
  })

  const handleSaveInfo = async () => {
    try {
      const membershipData: MembershipRequestDto = {
        name: getValues("name"),
        description: getValues("description"),
      };

      await updateMembership(details.id, membershipData, user?.Jwt!);

      toast({ status: "success", description: "Membership updated successfully" });
      await revalidateMemberships();
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

      toast({ status: "success", description: "Membership deleted successfully" });
      await revalidateMemberships();
    } catch (error) {
      toast({
        status: "error",
        description: "Error deleting membership",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-base font-medium flex items-center gap-2">
            <PencilIcon className="h-5 w-5 text-muted-foreground" />
            Membership Name
          </label>
          <Input
            {...register("name")}
            placeholder="Enter membership name"
            className="text-lg h-12 px-4"
          />
        </div>

        <div className="space-y-3">
          <label className="text-base font-medium flex items-center gap-2">
            <PencilIcon className="h-5 w-5 text-muted-foreground" />
            Description
          </label>
          <Textarea
            {...register("description")}
            placeholder="Describe the membership benefits and features"
            className="min-h-[150px] text-base p-4"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleDeleteMembership}
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete
        </Button>

        <Button
          onClick={handleSaveInfo}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}