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

  const updatePlan = (planId: string, field: string, value: string) => {
    // Here you would implement the logic to update a specific plan
    // This is a placeholder for the actual implementation
    console.log(`Updating plan ${planId}, field ${field} to ${value}`);

    // Update the local state
    setPlans(
      plans.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value } : plan,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-y-5 pt-3">
      {plans.map((plan, idx) => {
        return (
          <React.Fragment key={plan.id}>
            {idx !== 0 && <Separator className="my-8" />}

            <p>ID: {plan.id}</p>

            <div>
              <p className="pb-2">Name</p>
              <Input
                className="line-clamp-2"
                onChange={(e) => updatePlan(plan.id, "name", e.target.value)}
                type="text"
                value={plan.name}
              />
            </div>
            <div>
              <p className="pb-2">Payment Frequency</p>
              <Select
                value={plan.payment_frequency}
                onValueChange={(value) =>
                  updatePlan(plan.id, "payment_frequency", value)
                }
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

            {plan.amt_periods && (
              <div>
                <p className="pb-2">Amount of periods</p>
                <Input
                  className="line-clamp-2"
                  onChange={(e) =>
                    updatePlan(plan.id, "amt_periods", e.target.value)
                  }
                  type="number"
                  value={plan.amt_periods}
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
