import getValue from "@/configs/constants";
import { MembershipPlanPlanResponse } from "@/app/api/Api";
import { MembershipPlan } from "@/types/membership";

export async function getPlansForMembership(
  membershipId: string
): Promise<MembershipPlan[]> {
  try {
    const res = await fetch(
      `${getValue("API")}memberships/${membershipId}/plans`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Failed to fetch plans:`, res.status, errorText);
      throw new Error("Could not load membership plans");
    }

    const data: MembershipPlanPlanResponse[] = await res.json();

    return data.map((plan) => ({
      id: plan.id!,
      membership_id: plan.membership_id!,
      name: plan.name || "Unnamed Plan",
      stripe_price_id: plan.stripe_price_id || "",
      stripe_joining_fees_id: plan.stripe_joining_fees_id || "",
      amt_periods: plan.amt_periods || 0,
      price: (plan as any).price ?? 0,
      joining_fee: (plan as any).joining_fee ?? 0,
    }));
  } catch (err) {
    console.error("🔥 Error loading membership plans:", err);
    throw err;
  }
}
