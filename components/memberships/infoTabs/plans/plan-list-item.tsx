import { MembershipPlan } from "@/types/membership";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormData } from "@/hooks/form-data";

export default function MembershipPlanListItem({ plan, paymentFreqs }: { plan: MembershipPlan, paymentFreqs: string[] }) {

  const { data, resetData, isChanged, updateField } = useFormData({
    name: plan.name,
    payment_frequency: plan.payment_frequency?.payment_frequency,
    amt_periods: plan.payment_frequency?.amt_periods,
  })

  return (
    <div key={plan.id} className="space-y-3">

      <p>ID: {plan.id}</p>

      <div>
        <p className="pb-2">Name</p>
        <Input
          className="line-clamp-2"
          onChange={(e) =>
            updateField("name", e.target.value)
          }
          type="text"
          value={data.name}
        />
      </div>
      <div>
        <p className="pb-2">Payment Frequency</p>
        <Select
          value={data.payment_frequency}
          onValueChange={(value) =>
            updateField("payment_frequency", value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment frequency" />
          </SelectTrigger>
          <SelectContent>
            {
              paymentFreqs.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      {plan.payment_frequency?.amt_periods !== undefined && (
        <div>
          <p className="pb-2">Amount of periods</p>
          <Input
            className="line-clamp-2"
            onChange={(e) =>
              updateField("amt_periods", e.target.value)
            }
            type="number"
            value={data.amt_periods}
          />
        </div>
      )}

      <div className="flex justify-end gap-5">
        <Button disabled={!isChanged} onClick={resetData}>
          Reset data
        </Button>
        <Button disabled={!isChanged} onClick={() => { }}>
          Save membership
        </Button>
      </div>
    </div>
  )
}