"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Location } from "@/types/location";
import DetailsTab from "./infoTabs/Details";
import { BuildingIcon } from "lucide-react";
import SchedulesTab from "./infoTabs/Schedule";

export default function FacilityInfoPanel({
  facility,
  onDelete,
  onClose,
  isReceptionist = false,
}: {
  facility: Location;
  onDelete?: () => void;
  onClose?: () => void;
  isReceptionist?: boolean;
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
              <BuildingIcon className="h-4 w-4" />
              Information
            </TabsTrigger>
            {/* <TabsTrigger 
              value="schedule"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="details" className="pt-4">
          <DetailsTab
            details={facility}
            onDelete={onDelete}
            onClose={onClose}
            isReceptionist={isReceptionist}
          />
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <SchedulesTab facilityId={facility.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
