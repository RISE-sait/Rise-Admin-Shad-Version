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
  const [modifiedPlans, setModifiedPlans] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${getValue("API")}/memberships/${membership.id}/plans`)
      .then((res) => res.json())
      .then((data) => setPlans(data));
  }, [membership.id]);

  const updateMembership = async () => {
    // Ensure the name is not empty
    if (!data.name.trim()) {
      toast({
        status: "error",
        description: "membership name cannot be empty.",
      });
      return;
    }

    setLoading(true);

    try {
      // First update the membership
      const membershipResponse = await fetch(
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

      if (!membershipResponse.ok) {
        throw new Error("Failed to update membership");
      }

      // Then update all modified plans
      const planUpdatePromises = Object.keys(modifiedPlans).map(
        async (planId) => {
          const updateData = modifiedPlans[planId];
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
            throw new Error(`Failed to update plan: ${planId}`);
          }
        },
      );

      // Wait for all plan updates to complete
      await Promise.all(planUpdatePromises);

      // Clear the modified plans since everything is saved
      setModifiedPlans({});

      toast({
        status: "success",
        description: "All changes successfully saved.",
      });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: "An error occurred. Please try again.",
      });

      // Refresh plans from server to show current state
      fetch(`${getValue("API")}/memberships/${membership.id}/plans`)
        .then((res) => res.json())
        .then((data) => setPlans(data));
    } finally {
      setLoading(false);
    }
  };

  const updatePlanLocally = (
    planId: string,
    field: string,
    value: string | number,
  ) => {
    // Update the displayed plans immediately for UI responsiveness
    setPlans(
      plans.map((plan) => {
        if (plan.id === planId) {
          return { ...plan, [field]: value };
        }
        return plan;
      }),
    );

    // Track this change for saving later
    setModifiedPlans((prev) => {
      const planChanges = prev[planId] || {};
      return {
        ...prev,
        [planId]: {
          ...planChanges,
          [field]: value,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-y-5 pt-3">
      {plans.map((plan, idx) => {
        const planId = plan.id || `temp-${idx}`;

        return (
          <React.Fragment key={planId}>
            {idx !== 0 && <Separator className="my-8" />}

            <p>ID: {planId}</p>

            <div>
              <p className="pb-2">Name</p>
              <Input
                className="line-clamp-2"
                onChange={(e) =>
                  updatePlanLocally(planId, "name", e.target.value)
                }
                type="text"
                value={plan.name}
                disabled={loading}
              />
            </div>
            <div>
              <p className="pb-2">Payment Frequency</p>
              <Select
                value={plan.payment_frequency}
                onValueChange={(value) =>
                  updatePlanLocally(planId, "payment_frequency", value)
                }
                disabled={loading}
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
                    updatePlanLocally(planId, "amt_periods", e.target.value)
                  }
                  type="number"
                  value={plan.amt_periods}
                  disabled={loading}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}

      <section className="flex justify-between">
        <Button onClick={updateMembership} disabled={loading}>
          {loading ? "Saving..." : "Save membership"}
        </Button>
      </section>
    </div>
  );
}
