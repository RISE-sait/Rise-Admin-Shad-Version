import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import getValue from "@/configs/constants";
import { StaffRoleEnum } from "@/types/user";
import { MembershipPlan } from "@/types/membership";
import {
  getPlansForMembership,
  updatePlanVisibility,
} from "@/services/membershipPlan";

export default function PlansTab({ membershipId }: { membershipId: string }) {
  const { user } = useUser();
  const jwt = user?.Jwt;
  const { toast } = useToast();
  const apiUrl = getValue("API");
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  // states
  const [toggledPlanId, setToggledPlanId] = useState<string | null>(null);
  const [editablePlans, setEditablePlans] = useState<
    Record<string, Record<string, any>>
  >({});
  const [newPeriod, setNewPeriod] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newUnitAmount, setNewUnitAmount] = useState<string>("");
  const [newCurrency, setNewCurrency] = useState<string>("cad");
  const [newBillingInterval, setNewBillingInterval] = useState<string>("month");
  const [newJoiningFeeAmount, setNewJoiningFeeAmount] = useState<string>("");
  const [newPlanToggle, setNewPlanToggle] = useState(false);

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [visibilityLoading, setVisibilityLoading] = useState<string | null>(
    null
  );

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
          visibility: plan.visibility,
          unit_amount: plan.unit_amount ? (plan.unit_amount / 100).toFixed(2) : "",
          currency: plan.currency ?? "cad",
          billing_interval: plan.billing_interval ?? "month",
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

  const handleCancelPlan = (planId: string) => {
    setToggledPlanId((prev) => (prev === planId ? null : prev));
    setEditablePlans((prev) => {
      const { [planId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleVisibilityToggle = async (
    planId: string,
    nextVisibility: boolean
  ) => {
    if (!jwt) {
      toast({
        status: "error",
        description: "Authentication required to update plan visibility.",
        variant: "destructive",
      });
      return;
    }

    const previousPlans = plans.map((plan) => ({ ...plan }));
    setVisibilityLoading(planId);
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, visibility: nextVisibility } : plan
      )
    );
    setEditablePlans((prev) =>
      prev[planId]
        ? {
            ...prev,
            [planId]: {
              ...prev[planId],
              visibility: nextVisibility,
            },
          }
        : prev
    );

    try {
      await updatePlanVisibility(planId, nextVisibility, jwt);
      toast({
        status: "success",
        description: "Plan visibility updated successfully",
      });
      await refreshPlans();
    } catch (error) {
      console.error("Failed to update plan visibility", error);
      setPlans(previousPlans);
      setEditablePlans((prev) =>
        prev[planId]
          ? {
              ...prev,
              [planId]: {
                ...prev[planId],
                visibility:
                  previousPlans.find((plan) => plan.id === planId)
                    ?.visibility ?? false,
              },
            }
          : prev
      );
      toast({
        status: "error",
        description: "Failed to update plan visibility",
        variant: "destructive",
      });
    } finally {
      setVisibilityLoading(null);
    }
  };

  // toggle between adding new plans
  const toggleNewPlan = () => {
    setNewPlanToggle((prev) => {
      if (prev) {
        setNewName("");
        setNewUnitAmount("");
        setNewCurrency("cad");
        setNewBillingInterval("month");
        setNewJoiningFeeAmount("");
        setNewPeriod("");
      }
      return !prev;
    });
  };

  // add new plan
  const addNewPlan = async () => {
    // verify required fields
    if (!newName || !newUnitAmount || !newBillingInterval || !newPeriod) {
      toast({
        status: "error",
        description:
          "Please fill in all required fields (name, price, interval, periods).",
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

    // convert dollar amount to cents
    const parsedUnitAmount = Math.round(parseFloat(newUnitAmount) * 100);
    if (isNaN(parsedUnitAmount) || parsedUnitAmount <= 0) {
      toast({
        status: "error",
        description: "Price must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    // parse joining fee if provided
    let parsedJoiningFee: number | undefined;
    if (newJoiningFeeAmount) {
      parsedJoiningFee = Math.round(parseFloat(newJoiningFeeAmount) * 100);
      if (isNaN(parsedJoiningFee) || parsedJoiningFee < 0) {
        toast({
          status: "error",
          description: "Joining fee must be a valid number.",
          variant: "destructive",
        });
        return;
      }
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
          unit_amount: parsedUnitAmount,
          currency: newCurrency,
          billing_interval: newBillingInterval,
          joining_fee_amount: parsedJoiningFee || undefined,
          amt_periods: parsedPeriod,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          status: "error",
          description: errorData.message || "Plan failed to create successfully",
          variant: "destructive",
        });
      } else {
        toast({
          status: "success",
          description: "Plan created successfully (Stripe product auto-created)",
        });
        refreshPlans();
        setNewName("");
        setNewUnitAmount("");
        setNewCurrency("cad");
        setNewBillingInterval("month");
        setNewJoiningFeeAmount("");
        setNewPeriod("");
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

    // parse unit_amount (convert dollars to cents)
    let parsedUnitAmount: number | undefined;
    if (updatedPlan.unit_amount) {
      parsedUnitAmount = Math.round(parseFloat(updatedPlan.unit_amount) * 100);
      if (isNaN(parsedUnitAmount) || parsedUnitAmount < 0) {
        toast({
          status: "error",
          description: "Price must be a valid number.",
          variant: "destructive",
        });
        return;
      }
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
            ...(parsedUnitAmount !== undefined && { unit_amount: parsedUnitAmount }),
            ...(updatedPlan.currency && { currency: updatedPlan.currency }),
            ...(updatedPlan.billing_interval && { billing_interval: updatedPlan.billing_interval }),
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
      {plans.map((plan) => {
        const isActive = toggledPlanId === plan.id;
        if (isActive) {
          return (
            <div
              key={plan.id}
              className="w-full p-3 rounded-lg border-orange-500 border"
            >
              <div className="p-2 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="cursor-pointer"
                    onClick={() => handleTogglePlan(plan.id)}
                  >
                    <h1>{plan.name}</h1>
                    <div className="flex flex-wrap gap-x-2">
                      <h1 className="font-semibold text-sm pt-1 text-stone-500 pr-1">
                        {plan.unit_amount
                          ? `$${(plan.unit_amount / 100).toFixed(2)} ${plan.currency?.toUpperCase() || "CAD"}`
                          : "—"}
                      </h1>
                      <h1 className="text-stone-500 font-semibold text-sm pt-1">
                        • Every {plan.amt_periods} Periods
                      </h1>
                    </div>
                    {(plan.credit_allocation != null ||
                      plan.weekly_credit_limit != null) && (
                      <div className="flex flex-col text-xs text-stone-500 pt-1 space-y-0.5">
                        {plan.credit_allocation != null && (
                          <span>
                            Credits allocated: {plan.credit_allocation}
                          </span>
                        )}
                        {plan.weekly_credit_limit != null && (
                          <span>
                            Weekly credit limit: {plan.weekly_credit_limit}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className="flex flex-col items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Label className="text-xs text-muted-foreground">
                      Visible
                    </Label>
                    <Switch
                      checked={plan.visibility}
                      onCheckedChange={(checked) =>
                        handleVisibilityToggle(plan.id, checked)
                      }
                      disabled={visibilityLoading === plan.id || isReceptionist}
                      aria-label="Toggle plan visibility"
                    />
                  </div>
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
                      disabled={isReceptionist}
                    />
                  </div>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full pl-1">
                          <Label className="w-full text-muted-foreground">Stripe price id</Label>
                          <Input
                            className="w-full mt-1 text-muted-foreground cursor-not-allowed"
                            value={editablePlans[plan.id]?.stripe_price_id || ""}
                            placeholder={plan.stripe_price_id}
                            onClick={(e) => e.stopPropagation()}
                            disabled
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background border text-foreground">
                        <p>Changes must be made on dashboard.stripe.com</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="pt-3 flex">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full pr-5">
                          <Label className="w-full text-muted-foreground">Price ($)</Label>
                          <Input
                            className="w-full mt-1 text-muted-foreground cursor-not-allowed"
                            type="number"
                            step="0.01"
                            min="0"
                            value={editablePlans[plan.id]?.unit_amount || ""}
                            placeholder={plan.unit_amount ? (plan.unit_amount / 100).toFixed(2) : "0.00"}
                            onClick={(e) => e.stopPropagation()}
                            disabled
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background border text-foreground">
                        <p>Changes must be made on dashboard.stripe.com</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full pl-1">
                          <Label className="w-full text-muted-foreground">Currency</Label>
                          <select
                            className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background text-sm text-muted-foreground cursor-not-allowed"
                            value={editablePlans[plan.id]?.currency || "cad"}
                            onClick={(e) => e.stopPropagation()}
                            disabled
                          >
                            <option value="cad">CAD</option>
                            <option value="usd">USD</option>
                          </select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background border text-foreground">
                        <p>Changes must be made on dashboard.stripe.com</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="pt-3 flex">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full pr-5">
                          <Label className="w-full text-muted-foreground">Billing Interval</Label>
                          <select
                            className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background text-sm text-muted-foreground cursor-not-allowed"
                            value={editablePlans[plan.id]?.billing_interval || "month"}
                            onClick={(e) => e.stopPropagation()}
                            disabled
                          >
                            <option value="month">Monthly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="year">Yearly</option>
                            <option value="week">Weekly</option>
                            <option value="day">Daily</option>
                          </select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background border text-foreground">
                        <p>Changes must be made on dashboard.stripe.com</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="w-full pl-1">
                    {/* Empty div for spacing alignment */}
                  </div>
                </div>
                <div className="pt-3 flex">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full pr-5">
                          <Label className="w-full text-muted-foreground">Stripe join fee</Label>
                          <Input
                            className="w-full mt-1 text-muted-foreground cursor-not-allowed"
                            value={
                              editablePlans[plan.id]?.stripe_joining_fees_id || ""
                            }
                            placeholder={plan.stripe_joining_fees_id}
                            onClick={(e) => e.stopPropagation()}
                            disabled
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background border text-foreground">
                        <p>Changes must be made on dashboard.stripe.com</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full pl-1">
                          <Label className="w-full text-muted-foreground">Period</Label>
                          <Input
                            className="w-full mt-1 text-muted-foreground cursor-not-allowed"
                            value={editablePlans[plan.id]?.amt_periods || ""}
                            placeholder={plan.amt_periods.toString()}
                            onClick={(e) => e.stopPropagation()}
                            disabled
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background border text-foreground">
                        <p>Changes must be made on dashboard.stripe.com</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {!isReceptionist && (
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
                    <div
                      className="p-1 pl-5 pr-5 bg-yellow-700 hover:bg-yellow-900 rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelPlan(plan.id);
                      }}
                    >
                      {" "}
                      Cancel{" "}
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
                )}
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
              <div className="p-2 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1>{plan.name}</h1>
                    <div className="flex flex-wrap gap-x-2">
                      <h1 className="font-semibold text-sm pt-1 text-stone-500 pr-1">
                        {plan.unit_amount
                          ? `$${(plan.unit_amount / 100).toFixed(2)} ${plan.currency?.toUpperCase() || "CAD"}`
                          : "—"}
                      </h1>
                      <h1 className="text-stone-500 font-semibold text-sm pt-1">
                        • Every {plan.amt_periods} Periods
                      </h1>
                    </div>
                    {(plan.credit_allocation != null ||
                      plan.weekly_credit_limit != null) && (
                      <div className="flex flex-col text-xs text-stone-500 pt-1 space-y-0.5">
                        {plan.credit_allocation != null && (
                          <span>
                            Credits allocated: {plan.credit_allocation}
                          </span>
                        )}
                        {plan.weekly_credit_limit != null && (
                          <span>
                            Weekly credit limit: {plan.weekly_credit_limit}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className="flex flex-col items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Label className="text-xs text-muted-foreground">
                      Visible
                    </Label>
                    <Switch
                      checked={plan.visibility}
                      onCheckedChange={(checked) =>
                        handleVisibilityToggle(plan.id, checked)
                      }
                      disabled={visibilityLoading === plan.id || isReceptionist}
                      aria-label="Toggle plan visibility"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })}

      {!isReceptionist && (
        newPlanToggle ? (
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
                    placeholder="e.g. Monthly Gold Plan"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="w-full pl-1">
                  <Label className="w-full">Price ($)</Label>
                  <Input
                    className="w-full mt-1"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newUnitAmount}
                    onChange={(e) => setNewUnitAmount(e.target.value)}
                    placeholder="50.00"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="pt-3 flex">
                <div className="w-full pr-5">
                  <Label className="w-full">Billing Interval</Label>
                  <select
                    className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={newBillingInterval}
                    onChange={(e) => setNewBillingInterval(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="month">Monthly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                    <option value="day">Daily</option>
                  </select>
                </div>
                <div className="w-full pl-1">
                  <Label className="w-full">Currency</Label>
                  <select
                    className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="cad">CAD</option>
                    <option value="usd">USD</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex">
                <div className="w-full pr-5">
                  <Label className="w-full">Joining Fee ($) (optional)</Label>
                  <Input
                    className="w-full mt-1"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newJoiningFeeAmount}
                    onChange={(e) => setNewJoiningFeeAmount(e.target.value)}
                    placeholder="0.00"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="w-full pl-1">
                  <div className="flex items-center gap-1">
                    <Label>Billing Periods</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-background border text-foreground">
                          <p>Number of billing cycles before the membership ends.</p>
                          <p className="mt-1 text-muted-foreground">
                            Examples: 12 monthly = 1 year, 26 biweekly = 1 year, 52 weekly = 1 year
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    className="w-full mt-1"
                    type="number"
                    min="1"
                    value={newPeriod}
                    placeholder="12"
                    onChange={(e) => setNewPeriod(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

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
        )
      )}
    </div>
  );
}
