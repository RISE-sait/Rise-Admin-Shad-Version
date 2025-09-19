import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import getValue from "@/configs/constants";
import { MembershipPlan } from "@/types/membership";
import { getPlansForMembership } from "@/services/membershipPlan";

export default function PlansTab({ membershipId }: { membershipId: string }) {
  const { user } = useUser();
  const jwt = user?.Jwt;
  const { toast } = useToast();
  const apiUrl = getValue("API");

  // states
  const [toggledPlanId, setToggledPlanId] = useState<string | null>(null);
  const [editablePlans, setEditablePlans] = useState<
    Record<string, Record<string, any>>
  >({});
  const [newPeriod, setNewPeriod] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newStripePriceId, setNewStripePriceId] = useState<string>("");
  const [newStripeJoiningFeeId, setNewStripeJoiningFeeId] =
    useState<string>("");
  const [newPlanToggle, setNewPlanToggle] = useState(false);
  const [newUsingCredits, setNewUsingCredits] = useState(false);
  const [newCreditAllocation, setNewCreditAllocation] = useState<string>("");
  const [newWeeklyCreditLimit, setNewWeeklyCreditLimit] = useState<string>("");

  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const parseOptionalNumber = (value: unknown) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") {
        return undefined;
      }
      const numericValue = Number(trimmed);
      return Number.isNaN(numericValue) ? undefined : numericValue;
    }
    if (typeof value === "number") {
      return Number.isNaN(value) ? undefined : value;
    }
    return undefined;
  };

  const fetchPlans = async () => {
    try {
      const plansData = await getPlansForMembership(membershipId);
      setPlans(plansData);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        status: "error",
        description: "Error loading membership plans",
        variant: "destructive",
      });
    }
  };

  const refreshPlans = async () => {
    await fetchPlans();
  };

  useEffect(() => {
    fetchPlans();
  }, [membershipId]);

  // Toggle between opened plans, set updated plans
  const handleTogglePlan = (planId: string) => {
    if (toggledPlanId === planId) {
      setToggledPlanId(null);
    } else {
      const plan = plans.find((p) => p.id === planId);
      if (!plan) return;
      setToggledPlanId(planId);
      setEditablePlans((prev) => ({
        ...prev,
        [planId]: {
          ...plan,
          amt_periods: plan.amt_periods?.toString() ?? "",
          stripe_price_id: plan.stripe_price_id ?? "",
          stripe_joining_fees_id: plan.stripe_joining_fees_id ?? "",
          credit_allocation:
            plan.credit_allocation != null
              ? plan.credit_allocation.toString()
              : "",
          weekly_credit_limit:
            plan.weekly_credit_limit != null
              ? plan.weekly_credit_limit.toString()
              : "",
          usingCredits:
            plan.credit_allocation != null || plan.weekly_credit_limit != null,
        },
      }));
    }
  };

  // Change values in editable plan
  const handleInputChange = (
    planId: string,
    field: string,
    value: string | number | boolean
  ) => {
    setEditablePlans((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: value,
      },
    }));
  };

  const handlePlanCreditsToggle = (planId: string, enabled: boolean) => {
    setEditablePlans((prev) => {
      const currentPlan = prev[planId] || {};
      return {
        ...prev,
        [planId]: {
          ...currentPlan,
          usingCredits: enabled,
          credit_allocation: enabled
            ? (currentPlan.credit_allocation ?? "")
            : "",
          weekly_credit_limit: enabled
            ? (currentPlan.weekly_credit_limit ?? "")
            : "",
        },
      };
    });
  };

  // toggle between adding new plans
  const toggleNewPlan = () => {
    setNewPlanToggle((prev) => {
      if (prev) {
        setNewName("");
        setNewStripePriceId("");
        setNewStripeJoiningFeeId("");
        setNewPeriod("");
        setNewUsingCredits(false);
        setNewCreditAllocation("");
        setNewWeeklyCreditLimit("");
      }
      return !prev;
    });
  };

  const handleNewPlanCreditToggle = (enabled: boolean) => {
    setNewUsingCredits(enabled);
    if (!enabled) {
      setNewCreditAllocation("");
      setNewWeeklyCreditLimit("");
    }
  };

  // add new plan
  const addNewPlan = async () => {
    // verify no null enters
    if (!newName || !newStripePriceId || !newPeriod) {
      toast({
        status: "error",
        description:
          "Please fill in all required fields before adding a new plan.",
        variant: "destructive",
      });
      return;
    }

    // ensure period is a number
    const parsedPeriod = parseInt(newPeriod, 10);

    if (isNaN(parsedPeriod) || parsedPeriod <= 0) {
      toast({
        status: "error",
        description: "Period must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}memberships/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          membership_id: membershipId,
          name: newName,
          stripe_price_id: newStripePriceId,
          stripe_joining_fees_id: newStripeJoiningFeeId
            ? newStripeJoiningFeeId
            : undefined,
          amt_periods: parsedPeriod,
          ...(newUsingCredits
            ? {
                credit_allocation: parseOptionalNumber(newCreditAllocation),
                weekly_credit_limit: parseOptionalNumber(newWeeklyCreditLimit),
              }
            : {}),
        }),
      });
      if (!response.ok) {
        toast({
          status: "error",
          description: "Plan failed to create successfully",
          variant: "destructive",
        });
      } else {
        toast({
          status: "success",
          description: "Plan created successfully",
        });
        refreshPlans();
        setNewName("");
        setNewStripePriceId("");
        setNewStripeJoiningFeeId("");
        setNewPeriod("");
        setNewCreditAllocation("");
        setNewWeeklyCreditLimit("");
        setNewUsingCredits(false);
        setNewPlanToggle(false);
      }
    } catch (err) {
      console.error("Failed to save plan", err);
    }
  };

  // handle save
  const handleSave = async (planId: string) => {
    const updatedPlan = editablePlans[planId];

    // ensure period is a number
    const parsedPeriod = parseInt(String(updatedPlan.amt_periods), 10);
    if (isNaN(parsedPeriod) || parsedPeriod <= 0) {
      toast({
        status: "error",
        description: "Period must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}memberships/plans/${updatedPlan.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            membership_id: membershipId,
            name: updatedPlan.name,
            stripe_price_id: updatedPlan.stripe_price_id,
            stripe_joining_fees_id: updatedPlan.stripe_joining_fees_id
              ? updatedPlan.stripe_joining_fees_id
              : undefined,
            amt_periods: parsedPeriod,
            ...(updatedPlan.usingCredits
              ? {
                  credit_allocation: parseOptionalNumber(
                    updatedPlan.credit_allocation
                  ),
                  weekly_credit_limit: parseOptionalNumber(
                    updatedPlan.weekly_credit_limit
                  ),
                }
              : {}),
          }),
        }
      );
      if (!response.ok) {
        toast({
          status: "error",
          description: "Plan failed to update successfully",
          variant: "destructive",
        });
      } else {
        toast({
          status: "success",
          description: "Plan updated successfully",
        });
        refreshPlans();
      }
    } catch (err) {
      console.error("Failed to save plan", err);
    }
  };

  const DeletePlan = async (planId: string) => {
    try {
      const response = await fetch(`${apiUrl}memberships/plans/${planId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        toast({
          status: "error",
          description: "Plan failed to delete successfuly",
          variant: "destructive",
        });
      } else {
        toast({
          status: "success",
          description: "Plan deleted successfully",
        });
        refreshPlans();
      }
    } catch (err) {
      console.error("Failed to save plan", err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {plans.map((plan) => {
        const isActive = toggledPlanId === plan.id;
        if (isActive) {
          return (
            <div
              key={plan.id}
              className="w-full p-3 rounded-lg border-orange-500 border"
            >
              <div className="p-2">
                <div
                  className="cursor-pointer"
                  onClick={() => handleTogglePlan(plan.id)}
                >
                  <h1>{plan.name}</h1>
                  <div className="flex flex-wrap gap-x-2">
                    <h1 className="font-semibold text-sm pt-1 text-stone-500 pr-1">
                      Stripe price id
                    </h1>
                    <h1 className="text-stone-500 font-medium text-sm pt-1 pr-1">
                      {plan.stripe_price_id || "—"}
                    </h1>
                    <h1 className="text-stone-500 font-semibold text-sm pt-1">
                      • Every {plan.amt_periods} Months
                    </h1>
                  </div>
                  {(plan.credit_allocation != null ||
                    plan.weekly_credit_limit != null) && (
                    <div className="flex flex-col text-xs text-stone-500 pt-1 space-y-0.5">
                      {plan.credit_allocation != null && (
                        <span>Credits allocated: {plan.credit_allocation}</span>
                      )}
                      {plan.weekly_credit_limit != null && (
                        <span>
                          Weekly credit limit: {plan.weekly_credit_limit}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="pt-2 flex">
                  <div className="w-full pr-5">
                    <Label className="w-full">Name</Label>
                    <Input
                      className="w-full mt-1"
                      onChange={(e) =>
                        handleInputChange(plan.id, "name", e.target.value)
                      }
                      value={editablePlans[plan.id]?.name || ""}
                      placeholder={plan.name}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="w-full pl-1 ">
                    <Label className="w-full">Stripe price id</Label>
                    <Input
                      className="w-full mt-1"
                      onChange={(e) =>
                        handleInputChange(
                          plan.id,
                          "stripe_price_id",
                          e.target.value
                        )
                      }
                      value={editablePlans[plan.id]?.stripe_price_id || ""}
                      placeholder={plan.stripe_price_id}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="pt-3 flex">
                  <div className="w-full pr-5">
                    <Label className="w-full">Stripe join fee</Label>
                    <Input
                      className="w-full mt-1"
                      onChange={(e) =>
                        handleInputChange(
                          plan.id,
                          "stripe_joining_fees_id",
                          e.target.value
                        )
                      }
                      value={
                        editablePlans[plan.id]?.stripe_joining_fees_id || ""
                      }
                      placeholder={plan.stripe_joining_fees_id}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="w-full pl-1 ">
                    <Label className="w-full">Period</Label>
                    <Input
                      className="w-full mt-1"
                      onChange={(e) =>
                        handleInputChange(
                          plan.id,
                          "amt_periods",
                          e.target.value
                        )
                      }
                      value={editablePlans[plan.id]?.amt_periods || ""}
                      placeholder={plan.amt_periods.toString()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="pt-3 flex items-center space-x-2">
                  <Checkbox
                    id={`plan-${plan.id}-using-credits`}
                    checked={Boolean(editablePlans[plan.id]?.usingCredits)}
                    onCheckedChange={(checked) =>
                      handlePlanCreditsToggle(plan.id, checked === true)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label
                    htmlFor={`plan-${plan.id}-using-credits`}
                    className="text-sm font-medium cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Using credits
                  </Label>
                </div>
                {editablePlans[plan.id]?.usingCredits && (
                  <div className="pt-3 flex">
                    <div className="w-full pr-5">
                      <Label className="w-full">Credit allocation</Label>
                      <Input
                        className="w-full mt-1"
                        onChange={(e) =>
                          handleInputChange(
                            plan.id,
                            "credit_allocation",
                            e.target.value
                          )
                        }
                        value={editablePlans[plan.id]?.credit_allocation || ""}
                        placeholder="0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="w-full pl-1 ">
                      <Label className="w-full">Weekly credit limit</Label>
                      <Input
                        className="w-full mt-1"
                        onChange={(e) =>
                          handleInputChange(
                            plan.id,
                            "weekly_credit_limit",
                            e.target.value
                          )
                        }
                        value={
                          editablePlans[plan.id]?.weekly_credit_limit || ""
                        }
                        placeholder="0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
                <div className="flex pt-5 gap-3">
                  <div
                    className="p-1 pl-5 pr-5 bg-green-600 hover:bg-green-700 rounded cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(plan.id);
                    }}
                  >
                    {" "}
                    Save{" "}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div
                        className="p-1 pl-5 pr-5 bg-red-700 hover:bg-red-900 rounded cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {" "}
                        Delete{" "}
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this plan? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            DeletePlan(plan.id);
                          }}
                        >
                          Confirm Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={plan.id}
              className="w-full dark:hover:bg-gray-900 hover:bg-muted/100 cursor-pointer  p-3 rounded-lg border-grey-500 border"
              onClick={() => handleTogglePlan(plan.id)}
            >
              <div className="p-2">
                <h1>{plan.name}</h1>
                <div className="flex flex-wrap gap-x-2">
                  <h1 className="font-semibold text-sm pt-1 text-stone-500 pr-1">
                    Stripe price id
                  </h1>
                  <h1 className="text-stone-500 font-medium text-sm pt-1 pr-1">
                    {plan.stripe_price_id || "—"}
                  </h1>
                  <h1 className="text-stone-500 font-semibold text-sm pt-1">
                    • Every {plan.amt_periods} Months
                  </h1>
                </div>
                {(plan.credit_allocation != null ||
                  plan.weekly_credit_limit != null) && (
                  <div className="flex flex-col text-xs text-stone-500 pt-1 space-y-0.5">
                    {plan.credit_allocation != null && (
                      <span>Credits allocated: {plan.credit_allocation}</span>
                    )}
                    {plan.weekly_credit_limit != null && (
                      <span>
                        Weekly credit limit: {plan.weekly_credit_limit}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }
      })}

      {newPlanToggle ? (
        <div className="w-full p-3 rounded-lg border-orange-500 border">
          <div className="p-2">
            <div className="cursor-pointer" onClick={toggleNewPlan}>
              <h1> Add a new plan </h1>
            </div>
            <div className="pt-2 flex">
              <div className="w-full pr-5">
                <Label className="w-full">Name</Label>
                <Input
                  className="w-full mt-1"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="name of plan"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="w-full pl-1 ">
                <Label className="w-full">Stripe price id</Label>
                <Input
                  className="w-full mt-1"
                  value={newStripePriceId}
                  onChange={(e) => setNewStripePriceId(e.target.value)}
                  placeholder="price_..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="pt-3 flex">
              <div className="w-full pr-5">
                <Label className="w-full">Stripe join fee</Label>
                <Input
                  className="w-full mt-1"
                  value={newStripeJoiningFeeId}
                  onChange={(e) => setNewStripeJoiningFeeId(e.target.value)}
                  placeholder="price_..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="w-full pl-1 ">
                <Label className="w-full">Period</Label>
                <Input
                  className="w-full mt-1"
                  value={newPeriod}
                  placeholder="1"
                  onChange={(e) => setNewPeriod(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="pt-3 flex items-center space-x-2">
              <Checkbox
                id="new-plan-using-credits"
                checked={newUsingCredits}
                onCheckedChange={(checked) =>
                  handleNewPlanCreditToggle(checked === true)
                }
                onClick={(e) => e.stopPropagation()}
              />
              <Label
                htmlFor="new-plan-using-credits"
                className="text-sm font-medium cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Using credits
              </Label>
            </div>
            {newUsingCredits && (
              <div className="pt-3 flex">
                <div className="w-full pr-5">
                  <Label className="w-full">Credit allocation</Label>
                  <Input
                    className="w-full mt-1"
                    value={newCreditAllocation}
                    onChange={(e) => setNewCreditAllocation(e.target.value)}
                    placeholder="0"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="w-full pl-1 ">
                  <Label className="w-full">Weekly credit limit</Label>
                  <Input
                    className="w-full mt-1"
                    value={newWeeklyCreditLimit}
                    onChange={(e) => setNewWeeklyCreditLimit(e.target.value)}
                    placeholder="0"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            <div className="flex pt-5 gap-3">
              <div
                className="p-1 pl-5 pr-5 bg-green-600 hover:bg-green-700 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  addNewPlan();
                }}
              >
                {" "}
                Add plan{" "}
              </div>
              <div
                className="p-1 pl-5 pr-5 bg-red-700 hover:bg-red-900 rounded cursor-pointer"
                onClick={toggleNewPlan}
              >
                {" "}
                Cancel{" "}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="p-7 w-full h-12 cursor-pointer hover:text-stone-300 flex items-center justify-center rounded-lg border border-dotted"
          onClick={toggleNewPlan}
        >
          <h1 className="text-sm">Add New Plan + </h1>
        </div>
      )}
    </div>
  );
}
