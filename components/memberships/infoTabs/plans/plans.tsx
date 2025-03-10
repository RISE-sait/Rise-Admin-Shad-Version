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
import { Membership, MembershipPlan } from "@/types/membership";
import React, { useEffect, useState } from "react";
import MembershipPlanListItem from "./plan-list-item";

export default function PlansTab({ membership }: { membership: Membership }) {
  const { toast } = useToast();
  const { data, updateField } = useFormData({
    name: membership.name,
    description: membership.description,
  })

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [paymentsFreqs, setPaymentsFreqs] = useState<string[]>([]);

  const [modifiedPlans, setModifiedPlans] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const response: MembershipPlanPlanResponse[] = await (await fetch(`${getValue("API")}/memberships/${membership.id}/plans`)).json()

      setPlans(response.map((plan) => ({
        id: plan.id!,
        name: plan.name!,
        payment_frequency: {
          amt_periods: plan.amt_periods as number,
          payment_frequency: plan.payment_frequency as string,
        },
        membership_id: plan.membership_id!,
        price: plan.price!,
      })))
    })()
  }, [membership.id]);

  useEffect(() => {
    (async () => {
      const response = (await fetch(`${getValue("API")}/memberships/plans/payment-frequencies`)).json()

      const data = (await response).payment_frequencies

      setPaymentsFreqs(data)
    })()
  }, []);

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


  return (
    <div className="flex flex-col space-y-10 pt-3">
      {plans.map((plan) => <React.Fragment key={plan.id}>
        <MembershipPlanListItem key={plan.id} plan={plan} paymentFreqs={paymentsFreqs} />
        <Separator />
      </React.Fragment>
      )}
    </div>
  );
}