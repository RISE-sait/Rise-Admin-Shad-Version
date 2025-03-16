"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Membership, MembershipPlan } from "@/types/membership";
import DetailsTab from "./infoTabs/Details";
import PlansTab from "./infoTabs/plans/plans"; 
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon } from "lucide-react";
import getValue from "@/components/Singleton";

export default function MembershipInfoPanel({ membership }: { membership: Membership }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [membershipDetails, setMembershipDetails] = useState({
    name: membership.name,
    description: membership.description || ""
  });
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  
  const apiUrl = getValue("API");

  // Fetch membership plans when component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${apiUrl}/memberships/${membership.id}/plans`);
        if (!response.ok) throw new Error("Failed to fetch membership plans");
        
        const plansData = await response.json();
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast({ status: "error", description: "Error loading membership plans", variant: "destructive" });
      }
    };

    fetchPlans();
  }, [membership.id, apiUrl, toast]);

  const handleSaveAll = async () => {
    try {
      // Save membership details
      const response = await fetch(`${apiUrl}/memberships/${membership.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(membershipDetails)
      });

      if (!response.ok) throw new Error("Failed to save membership details");
      
      toast({ status: "success", description: "All changes saved successfully" });
    } catch (error) {
      toast({ status: "error", description: "Error saving changes", variant: "destructive" });
    }
  };

  const handleDeleteMembership = async () => {
    try {
      const response = await fetch(`${apiUrl}/memberships/${membership.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete membership");
      
      toast({ status: "success", description: "Membership deleted successfully" });
      window.location.reload(); // Refresh the page to reflect deletion
    } catch (error) {
      toast({ status: "error", description: "Error deleting membership", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-muted/50">
          <TabsTrigger value="details">Membership Details</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <DetailsTab
            details={membershipDetails}
            onDetailsChange={setMembershipDetails}
          />
        </TabsContent>
        
        <TabsContent value="plans" className="pt-4">
          <PlansTab
            membershipId={membership.id}
            plans={plans}
            onPlansChange={setPlans}
          />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
  <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
    <p className="text-sm text-muted-foreground">Last updated: {membership.updated_at ? new Date(membership.updated_at).toLocaleString() : 'Never'}</p>
    
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