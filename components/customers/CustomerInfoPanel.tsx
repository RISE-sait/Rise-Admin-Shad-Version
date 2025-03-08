"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Customer } from "@/types/customer";
import DetailsTab from "./infoTabs/CustomerDetails";

export default function CustomerInfoPanel({
  customer,
}: {
  customer: Customer;
}) {
  const [tabValue, setTabValue] = useState("details");

  return (
    <Tabs value={tabValue} onValueChange={setTabValue}>
      <TabsList className="w-full">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="membership">Membership</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <DetailsTab customer={customer} />
      </TabsContent>
      <TabsContent value="membership">
        <div className="p-4 text-center text-gray-500">
          Membership information will be available soon.
        </div>
      </TabsContent>
      <TabsContent value="attendance">
        <div className="p-4 text-center text-gray-500">
          Attendance history will be available soon.
        </div>
      </TabsContent>
    </Tabs>
  );
}
