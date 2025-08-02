"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Membership } from "@/types/membership";
import DetailsTab from "./infoTabs/Details";
import PlansTab from "./infoTabs/plans/Plans";
import { CreditCard, ShoppingBag } from "lucide-react";

export default function MembershipInfoPanel({
  membership,
  onClose,
}: {
  membership: Membership;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("details");

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
          <DetailsTab details={membership} onClose={onClose} />
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-center pt-5">
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {membership.updated_at
                ? new Date(membership.updated_at).toLocaleString()
                : "Never"}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="pt-4">
          <PlansTab membershipId={membership.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
