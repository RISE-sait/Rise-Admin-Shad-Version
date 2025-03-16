"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Customer } from "@/types/customer";
import DetailsTab from "./infoTabs/CustomerDetails";
import { Button } from "@/components/ui/button";
import { TrashIcon, SaveIcon, UserCircle, CreditCard, Clock } from "lucide-react";

export default function CustomerInfoPanel({
  customer,
}: {
  customer: Customer;
}) {
  const [tabValue, setTabValue] = useState("details");

  // Functions to handle save and delete actions
  const handleSaveChanges = async () => {
    // Add your save logic here
    console.log("Saving customer changes");
    // Example: await updateCustomer(customer.id, updatedData);
  };

  const handleDeleteCustomer = async () => {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      // Add your delete logic here
      console.log("Deleting customer");
      // Example: await deleteCustomer(customer.id);
    }
  };

  return (
    <div className="space-y-6">
    <Tabs value={tabValue} onValueChange={setTabValue}>
      <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger 
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <UserCircle className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="membership"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              Membership
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 dark:data-[state=active]:border-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Clock className="h-4 w-4" />
              Attendance
            </TabsTrigger>
          </TabsList>
        </div>
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
    <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
    <div className="max-w-full mx-auto px-2 flex justify-between items-center">
      <p className="text-sm text-muted-foreground">
        Last updated: {customer.updated_at ? new Date(customer.updated_at).toLocaleString() : 'Never'}
      </p>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleDeleteCustomer}
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete
        </Button>
        
        <Button
          onClick={handleSaveChanges}
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
