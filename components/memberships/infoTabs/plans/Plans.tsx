import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [editablePlans, setEditablePlans] = useState<any>({});
  const [newperiod, setnewperiod] = useState<any>();
  const [newname, setnewname] = useState<string>("");
  const [newprice, setnewprice] = useState<string>("");
  const [newjoiningfee, setnewjoiningfee] = useState<string>("");
  const [newplantoggle, setnewplantoggle] = useState(false);

  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
    }).format(price);

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
      setToggledPlanId(planId);
      setEditablePlans((prev: any) => ({
        ...prev,
        [planId]: plans.find((p) => p.id === planId),
      }));
    }
  };

  // Change values in editable plan
  const handleInputChange = (planId: string, field: string, value: string) => {
    setEditablePlans((prev: any) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: value,
      },
    }));
  };

  // toggle between adding new plans
  const togglenewplan = () => {
    if (newplantoggle == false) {
      setnewplantoggle(true);
    } else setnewplantoggle(false);
  };

  // add new plan
  const addnewplan = async () => {
    // verify no null enters
    if (!newname || !newprice || !newperiod) {
      toast({
        status: "error",
        description:
          "Please fill in all required fields before adding a new plan.",
        variant: "destructive",
      });
      return;
    }

    // ensure period is a number
    const parsedPeriod = parseInt(newperiod, 10);

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
          name: newname,
          price: parseFloat(newprice),
          joining_fee: newjoiningfee ? parseFloat(newjoiningfee) : undefined,
          amt_periods: parsedPeriod,
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
        setnewname("");
        setnewprice("");
        setnewjoiningfee("");
        setnewperiod("");
        setnewplantoggle(false);
      }
    } catch (err) {
      console.error("Failed to save plan", err);
    }
  };

  // handle save
  const handleSave = async (planId: string) => {
    const updatedPlan = editablePlans[planId];

    // ensure period is a number
    const parsedPeriod = parseInt(updatedPlan.amt_periods, 10);
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
            price: parseFloat(updatedPlan.price),
            joining_fee: updatedPlan.joining_fee
              ? parseFloat(updatedPlan.joining_fee)
              : undefined,
            amt_periods: parsedPeriod,
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
    <div>
      {plans.map((plan) => {
        const isActive = toggledPlanId === plan.id;
        if (isActive) {
          return (
            <div
              key={plan.id}
              className="w-full p-3 mb-3 rounded-lg border-orange-500 border"
            >
              <div className="p-2">
                <div
                  className="cursor-pointer"
                  onClick={() => handleTogglePlan(plan.id)}
                >
                  <h1>{plan.name}</h1>
                  <div className="flex">
                    <h1 className="font-semibold text-sm pt-1 text-stone-500 pr-1">
                      Price
                    </h1>
                    <h1 className="text-stone-500 font-medium text-sm pt-1 pr-1">
                      {plan.price ?? 0}
                    </h1>
                    <h1 className="text-stone-500 font-semibold text-sm pt-1">
                      • Every {plan.amt_periods} Months
                    </h1>
                  </div>
                </div>
                <div className="pt-2 flex">
                  <div className="w-full pr-5">
                    <Label className="w-full"> Plan Name </Label>
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
                    <Label className="w-full"> Price </Label>
                    <Input
                      className="w-full mt-1"
                      onChange={(e) =>
                        handleInputChange(plan.id, "price", e.target.value)
                      }
                      value={editablePlans[plan.id]?.price || ""}
                      placeholder={plan.price?.toString()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="pt-3 flex">
                  <div className="w-full pr-5">
                    <Label className="w-full">Joining Fee</Label>
                    <Input
                      className="w-full mt-1"
                      onChange={(e) =>
                        handleInputChange(
                          plan.id,
                          "joining_fee",
                          e.target.value
                        )
                      }
                      value={editablePlans[plan.id]?.joining_fee || ""}
                      placeholder={plan.joining_fee?.toString()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="w-full pl-1 ">
                    <Label className="w-full"> Period </Label>
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
                    className="p-1 pl-5 pr-5 bg-red-700 hover:bg-red-900 rounded cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation;
                      DeletePlan(plan.id);
                    }}
                  >
                    {" "}
                    Delete{" "}
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={plan.id}
              className="w-full dark:hover:bg-gray-900 hover:bg-muted/100 cursor-pointer  p-3 mb-3 rounded-lg border-grey-500 border"
              onClick={() => handleTogglePlan(plan.id)}
            >
              <div className="p-2">
                <h1>{plan.name}</h1>
                <div className="flex">
                  <h1 className="font-semibold text-sm pt-1 text-stone-500 pr-1">
                    Price
                  </h1>
                  <h1 className="text-stone-500 font-medium text-sm pt-1 pr-1">
                    {formatPrice(plan.price ?? 0)}
                  </h1>
                  <h1 className="text-stone-500 font-semibold text-sm pt-1">
                    • Every {plan.amt_periods} Months
                  </h1>
                </div>
              </div>
            </div>
          );
        }
      })}

      {newplantoggle ? (
        <div className="w-full p-3 mb-3 rounded-lg border-orange-500 border">
          <div className="p-2">
            <div className="cursor-pointer" onClick={togglenewplan}>
              <h1> Add a new plan </h1>
            </div>
            <div className="pt-2 flex">
              <div className="w-full pr-5">
                <Label className="w-full"> Plan Name </Label>
                <Input
                  className="w-full mt-1"
                  value={newname ?? ""}
                  onChange={(e) => setnewname(e.target.value)}
                  placeholder="name of plan"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="w-full pl-1 ">
                <Label className="w-full">Price</Label>
                <Input
                  className="w-full mt-1"
                  value={newprice ?? ""}
                  onChange={(e) => setnewprice(e.target.value)}
                  placeholder="0"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="pt-3 flex">
              <div className="w-full pr-5">
                <Label className="w-full">Joining Fee</Label>
                <Input
                  className="w-full mt-1"
                  value={newjoiningfee ?? ""}
                  onChange={(e) => setnewjoiningfee(e.target.value)}
                  placeholder="0"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="w-full pl-1 ">
                <Label className="w-full"> Period </Label>
                <Input
                  className="w-full mt-1"
                  value={newperiod ?? ""}
                  placeholder="1"
                  onChange={(e) => setnewperiod(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="flex pt-5 gap-3">
              <div
                className="p-1 pl-5 pr-5 bg-green-600 hover:bg-green-700 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation;
                  addnewplan();
                }}
              >
                {" "}
                Add plan{" "}
              </div>
              <div
                className="p-1 pl-5 pr-5 bg-red-700 hover:bg-red-900 rounded cursor-pointer"
                onClick={togglenewplan}
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
          onClick={togglenewplan}
        >
          <h1 className="text-sm">Add New Plan + </h1>
        </div>
      )}
    </div>
  );
}
