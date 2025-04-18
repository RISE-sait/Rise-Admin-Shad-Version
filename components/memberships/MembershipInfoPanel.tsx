"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Membership, MembershipPlan } from "@/types/membership";
import DetailsTab from "./infoTabs/Details";
import PlansTab from "./infoTabs/plans/Plans";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  TrashIcon,
  SaveIcon,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import getValue from "@/configs/constants";
import { deleteMembership, updateMembership } from "@/services/membership";
import { useUser } from "@/contexts/UserContext";
import { MembershipRequestDto } from "@/app/api/Api";
import { revalidateMemberships } from "@/app/actions/serverActions";

export default function MembershipInfoPanel({ membership }: { membership: Membership }) {
  const { toast } = useToast();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState("details");
  const [membershipDetails, setMembershipDetails] = useState({
    name: membership.name,
    description: membership.description || "",
  });
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const apiUrl = getValue("API");

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${apiUrl}memberships/${membership.id}/plans`);
      if (!response.ok) throw new Error("Failed to fetch membership plans");

      const plansData = await response.json();
      setPlans(plansData);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        status: "error",
        description: "Error loading membership plans",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [membership.id]);

  const handleSaveInfo = async () => {
    try {
      const membershipData: MembershipRequestDto = {
        name: membershipDetails.name,
        description: membershipDetails.description,
      };

      await updateMembership(membership.id, membershipData, user?.Jwt!);

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
      await deleteMembership(membership.id, user?.Jwt!);

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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              Membership Details
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              Plans
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="pt-4">
          <DetailsTab
            details={membershipDetails}
            onDetailsChange={setMembershipDetails}
          />
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-center pt-5">
            <p className="text-sm text-muted-foreground">
              Last updated: {membership.updated_at ? new Date(membership.updated_at).toLocaleString() : "Never"}
            </p>

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
        </TabsContent>

        <TabsContent value="plans" className="pt-4">
          <PlansTab
            RenderPlans={plans}
            MembershipID={membership.id}
            refreshPlans={fetchPlans}
          />
        </TabsContent>
      </Tabs>

    </div>
  );
}
