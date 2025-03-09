import { MembershipPlanPlanResponse } from "@/app/api/Api";
import getValue from "@/components/Singleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useFormData } from "@/hooks/form-data";
import { useToast } from "@/hooks/use-toast";
import { Membership } from "@/types/membership";
import React, { useEffect, useState } from "react";

export default function PlansTab({ membership }: { membership: Membership }) {
  const { toast } = useToast();
  const { data, updateField } = useFormData({
    name: membership.name,
    description: membership.description,
  });
  const [plans, setPlans] = useState<MembershipPlanPlanResponse[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`${getValue("API")}/memberships/${membership.id}/plans`)
      .then((res) => res.json())
      .then((data) => setPlans(data));
  }, [membership.id]);

  const updatemembership = async () => {
    // Ensure the name is not empty
    if (!data.name.trim()) {
      toast({
        status: "error",
        description: "membership name cannot be empty.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/memberships/${membership.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update membership");
      }

      toast({
        status: "success",
        description: "Successfully saved.",
      });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: "An error occurred. Please try again.",
      });
    }
  };

  const updatePlan = async (
    planId: string,
    field: string,
    value: string | number,
  ) => {
    try {
      // Set loading state for this plan
      setLoading((prev) => ({ ...prev, [planId]: true }));

      // Update the local state immediately for a responsive UI
      setPlans(
        plans.map((plan) => {
          // Check if this is the plan we want to update
          if (plan.id === planId) {
            // Create a new object with the updated field
            return { ...plan, [field]: value };
          }
          // Return the plan unchanged
          return plan;
        }),
      );

      // Prepare the update data
      const updateData: Record<string, any> = {};
      updateData[field] = value;

      // Send the update to the API
      const response = await fetch(
        `${getValue("API")}/memberships/plans/${planId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update plan: ${field}`);
      }

      // If successful, show a success message
      toast({
        status: "success",
        description: `Plan ${field} updated successfully.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: `Failed to update ${field}. Please try again.`,
      });

      // Revert the local state change if the API call failed
      fetch(`${getValue("API")}/memberships/${membership.id}/plans`)
        .then((res) => res.json())
        .then((data) => setPlans(data));
    } finally {
      // Clear loading state
      setLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-y-5 pt-3">
      {plans.map((plan, idx) => {
        // Log the plan object to debug
        console.log("Plan data:", plan);

        // Make sure we have a valid plan ID
        const planId = plan.id || `temp-${idx}`;

        return (
          <React.Fragment key={planId}>
            {idx !== 0 && <Separator className="my-8" />}

            <p>ID: {planId}</p>

            <div>
              <p className="pb-2">Name</p>
              <Input
                className="line-clamp-2"
                onChange={(e) => updatePlan(planId, "name", e.target.value)}
                type="text"
                value={plan.name}
                disabled={loading[planId]}
              />
            </div>
            <div>
              <p className="pb-2">Payment Frequency</p>
              <Select
                value={plan.payment_frequency}
                onValueChange={(value) =>
                  updatePlan(planId, "payment_frequency", value)
                }
                disabled={loading[planId]}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Payment</SelectItem>
                  <SelectItem value="weekly">Weekly Payment</SelectItem>
                  <SelectItem value="monthly">Monthly Payment</SelectItem>
                  <SelectItem value="yearly">Yearly Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {plan.amt_periods !== undefined && (
              <div>
                <p className="pb-2">Amount of periods</p>
                <Input
                  className="line-clamp-2"
                  onChange={(e) =>
                    updatePlan(planId, "amt_periods", e.target.value)
                  }
                  type="number"
                  value={plan.amt_periods}
                  disabled={loading[planId]}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}

      <section className="flex justify-between">
        <Button onClick={updatemembership}>Save membership</Button>
      </section>
    </div>
  );
}
