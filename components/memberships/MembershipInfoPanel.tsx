"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import { Membership } from "@/types/membership";
import PlansTab from "./infoTabs/plans/plans";

const tabOptions = ["details", "plans"] as const;

type tabOption = typeof tabOptions[number];

export default function MembershipInfoPanel({ membership }: { membership: Membership }) {
  const [tabValue, setTabValue] = useState<tabOption>("details");

  return (
    <Tabs value={tabValue} onValueChange={(val) => setTabValue(val as tabOption)}>
      <TabsList className="w-full">
        {
          tabOptions.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))
        }
      </TabsList>
      <TabsContent value="details">
        <DetailsTab membership={membership} />
      </TabsContent>
      <TabsContent value="plans">
        <PlansTab membership={membership} />
      </TabsContent>
    </Tabs>
  );
}
