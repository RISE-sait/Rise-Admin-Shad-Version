"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Customer } from "@/types/customer";
import DetailsTab from "./infoTabs/CustomerDetails";
import { Button } from "@/components/ui/button";
import { TrashIcon, SaveIcon, UserCircle, CreditCard, Clock, RefreshCw } from "lucide-react";
import CustomerService from "@/services/customer";
import { toast } from "sonner";

interface CustomerStatsProps {
  wins?: number;
  losses?: number;
  points?: number;
  assists?: number;
  rebounds?: number;
  steals?: number;
}

interface CustomerInfoPanelProps {
  customer: Customer;
  onCustomerUpdated?: () => void;
  onCustomerDeleted?: () => void; // No customerId parameter
}

export default function CustomerInfoPanel({
  customer,
  onCustomerUpdated,
  onCustomerDeleted,
}: CustomerInfoPanelProps) {
  const [tabValue, setTabValue] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [customerStats, setCustomerStats] = useState<CustomerStatsProps>({});
  const [membershipPlans, setMembershipPlans] = useState([]);
  
  const customerService = new CustomerService();

  useEffect(() => {
    // Load customer stats if customer has ID
    if (customer.customer_id) {
      loadCustomerStats();
      loadMembershipPlans();
    }
  }, [customer.customer_id]);

  const loadCustomerStats = async () => {
    if (!customer.customer_id) return;
    
    setIsLoading(true);
    try {
      const stats = await customerService.getCustomerStats(customer.customer_id);
      setCustomerStats(stats);
    } catch (error) {
      console.error("Error loading customer stats:", error);
      // Don't show error toast as this might be optional data
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembershipPlans = async () => {
    if (!customer.customer_id) return;
    
    try {
      const plans = await customerService.getCustomerMembershipPlans(customer.customer_id);
      setMembershipPlans(plans);
    } catch (error) {
      console.error("Error loading membership plans:", error);
      // Don't show error toast as this might be optional data
    }
  };

  const handleSaveChanges = async () => {
    // This function is now handled in the DetailsTab component
    console.log("Save changes delegated to child component");
  };

  const handleDeleteCustomer = async () => {
    try {
      // Your delete logic here
      
      // Call the callback without parameters
      if (onCustomerDeleted) {
        onCustomerDeleted();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Combine customer data with stats
  const enrichedCustomer = {
    ...customer,
    ...customerStats
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Customer Profile
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            loadCustomerStats();
            loadMembershipPlans();
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger 
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <UserCircle className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="membership"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              Membership
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Clock className="h-4 w-4" />
              Attendance
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="details">
          <DetailsTab 
            customer={enrichedCustomer} 
            onCustomerUpdated={() => {
              if (onCustomerUpdated) onCustomerUpdated();
              loadCustomerStats(); // Reload stats after update
              toast.success("Customer information updated");
            }} 
          />
        </TabsContent>
        
        <TabsContent value="membership">
          {membershipPlans && membershipPlans.length > 0 ? (
            <div className="space-y-4">
              {membershipPlans.map((plan: any) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium">{plan.membership_name || "Membership Plan"}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 font-medium">{plan.status}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <span className="ml-2 font-medium">
                        {plan.start_date ? new Date(plan.start_date).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Renewal:</span>
                      <span className="ml-2 font-medium">
                        {plan.renewal_date ? new Date(plan.renewal_date).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No membership plans found for this customer.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attendance">
          <div className="p-4 text-center text-muted-foreground">
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
          </div>
        </div>
      </div>
    </div>
  );
}