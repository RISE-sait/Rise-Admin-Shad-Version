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

    // Ensure numeric values for price-related fields to avoid NaN when formatting
    const parseNumber = (value: unknown): number => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const cleaned = value.replace(/[^0-9.-]+/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

    return data.map((plan) => ({
      id: plan.id!,
      membership_id: plan.membership_id!,
      name: plan.name || "Unnamed Plan",
      stripe_price_id: plan.stripe_price_id || "",
      stripe_joining_fees_id: plan.stripe_joining_fees_id || "",
      amt_periods: plan.amt_periods || 0,
      price: parseNumber((plan as any).price),
      joining_fee: parseNumber((plan as any).joining_fee),
    }));
  } catch (err) {
    console.error("🔥 Error loading membership plans:", err);
    throw err;
  }
}
