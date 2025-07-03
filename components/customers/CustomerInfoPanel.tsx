"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Customer } from "@/types/customer";
import DetailsTab from "./infoTabs/CustomerDetails";
import { Button } from "@/components/ui/button";
import {
  TrashIcon,
  UserCircle,
  CreditCard,
  Clock,
  RefreshCw,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCustomerById,
  archiveCustomer,
  unarchiveCustomer,
} from "@/services/customer";
import { useUser } from "@/contexts/UserContext";

interface MembershipPlan {
  id: string;
  membership_name: string;
  status: string;
  start_date: Date | null;
  renewal_date: string;
}

interface CustomerInfoPanelProps {
  customer: Customer;
  onCustomerUpdated?: () => void;
  onCustomerArchived?: (id: string) => Promise<void> | void;
}

export default function CustomerInfoPanel({
  customer,
  onCustomerUpdated,
  onCustomerArchived,
}: CustomerInfoPanelProps) {
  const [tabValue, setTabValue] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(customer);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);

  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    // Update currentCustomer when the customer prop changes
    setCurrentCustomer(customer);

    // Initialize membership plans from the provided customer data
    if (customer.membership_plan_id) {
      const plan: MembershipPlan = {
        id: customer.membership_plan_id,
        membership_name: customer.membership_name || "Membership Plan",
        status: "Active",
        start_date: customer.membership_start_date,
        renewal_date: customer.membership_renewal_date,
      };
      setMembershipPlans([plan]);
    } else {
      setMembershipPlans([]);
    }
  }, [customer]);

  const refreshCustomerData = async () => {
    if (!customer.id) return;

    setIsLoading(true);
    try {
      // Use the unified getCustomerById function to get all data
      const refreshedCustomer = await getCustomerById(customer.id);
      if (refreshedCustomer) {
        setCurrentCustomer(refreshedCustomer);

        // Create a membership plan object from the customer data if available
        if (refreshedCustomer.membership_plan_id) {
          const membershipPlan: MembershipPlan = {
            id: refreshedCustomer.membership_plan_id,
            membership_name:
              refreshedCustomer.membership_name || "Membership Plan",
            status: "Active", // Assuming active if it exists
            start_date: refreshedCustomer.membership_start_date,
            renewal_date: refreshedCustomer.membership_renewal_date,
          };
          setMembershipPlans([membershipPlan]);
        } else {
          setMembershipPlans([]);
        }
      }
    } catch (error) {
      console.error("Error refreshing customer data:", error);
      // Don't show error toast as this might be non-critical
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      if (!user) return;
      if (currentCustomer.is_archived) {
        await unarchiveCustomer(currentCustomer.id, user.Jwt);
      } else {
        await archiveCustomer(currentCustomer.id, user.Jwt);
      }
      onCustomerArchived?.(currentCustomer.id);
    } catch (error) {
      console.error("Error archiving customer:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={refreshCustomerData}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Refreshing..." : "Refresh"}
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
            {/* <TabsTrigger
              value="stats"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Award className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Clock className="h-4 w-4" />
              Attendance
            </TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="details">
          <DetailsTab
            customer={currentCustomer}
            onCustomerUpdated={(updated) => {
              setCurrentCustomer((prev) => ({ ...prev, ...updated }));
              onCustomerUpdated?.();
              toast({
                status: "success",
                description: "Customer information updated",
              });
            }}
          />
        </TabsContent>

        <TabsContent value="membership">
          {membershipPlans && membershipPlans.length > 0 ? (
            <div className="space-y-4">
              {membershipPlans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium">
                    {plan.membership_name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 font-medium">{plan.status}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <span className="ml-2 font-medium">
                        {plan.start_date
                          ? new Date(plan.start_date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Renewal:</span>
                      <span className="ml-2 font-medium">
                        {plan.renewal_date
                          ? new Date(plan.renewal_date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mb-4">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No Membership Information
              </h3>
              <p className="text-muted-foreground">
                This customer doesn't have any membership plans associated with
                their account.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Stats Tab - This will show the athlete_info data that is available */}
        {/* <TabsContent value="stats">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Athletic Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.assists}</p>
                <p className="text-sm text-muted-foreground">Assists</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.points}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.rebounds}</p>
                <p className="text-sm text-muted-foreground">Rebounds</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.steals}</p>
                <p className="text-sm text-muted-foreground">Steals</p>
              </div>
              <div className="bg-success/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-success">{currentCustomer.wins}</p>
                <p className="text-sm text-muted-foreground">Wins</p>
              </div>
              <div className="bg-destructive/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-destructive">{currentCustomer.losses}</p>
                <p className="text-sm text-muted-foreground">Losses</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="p-8 text-center">
            <div className="mb-4">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-medium mb-2">Attendance History</h3>
            <p className="text-muted-foreground">
              Attendance tracking feature will be available soon.
            </p>
          </div>
        </TabsContent>*/}
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-full mx-auto px-2 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated:{" "}
            {currentCustomer.updated_at
              ? new Date(currentCustomer.updated_at).toLocaleString()
              : "Never"}
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleArchiveToggle}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {currentCustomer.is_archived ? "Unarchive" : "Archive"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
