import getValue from "@/configs/constants";
import { MembershipPlanPlanResponse } from "@/app/api/Api";
import { MembershipPlan } from "@/types/membership";
import { getAllMemberships } from "@/services/membership";

export interface MembershipPlanWithMembershipName extends MembershipPlan {
  membershipName: string;
}

type MembershipPlanResponseLike = MembershipPlanPlanResponse & {
  visibility?: boolean;
  is_visible?: boolean;
  credit_allocation?: number | null;
  weekly_credit_limit?: number | null;
  unit_amount?: number | null;
  currency?: string | null;
  interval?: string | null;
};

function mapMembershipPlan(plan: MembershipPlanResponseLike): MembershipPlan {
  return {
    id: plan.id!,
    membership_id: plan.membership_id!,
    name: plan.name || "Unnamed Plan",
    stripe_price_id: plan.stripe_price_id || "",
    stripe_joining_fees_id: plan.stripe_joining_fees_id || "",
    amt_periods: plan.amt_periods || 0,
    credit_allocation: plan.credit_allocation ?? null,
    weekly_credit_limit: plan.weekly_credit_limit ?? null,
    visibility: plan.visibility ?? plan.is_visible ?? true,
    unit_amount: plan.unit_amount ?? null,
    currency: plan.currency ?? null,
    billing_interval: plan.interval ?? null,
  };
}

export async function getPlansForMembership(
  membershipId: string
): Promise<MembershipPlan[]> {
  try {
    const res = await fetch(
      `${getValue("API")}memberships/${membershipId}/plans?include_hidden=true`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Failed to fetch plans:`, res.status, errorText);
      throw new Error("Could not load membership plans");
    }

    const data: MembershipPlanResponseLike[] = await res.json();

    return data.map(mapMembershipPlan);
  } catch (err) {
    console.error("🔥 Error loading membership plans:", err);
    throw err;
  }
}

async function patchPlanVisibility(
  url: string,
  visibility: boolean,
  jwt: string
): Promise<Response> {
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ is_visible: visibility }),
  });
}

export async function updatePlanVisibility(
  planId: string,
  visibility: boolean,
  jwt: string
): Promise<void> {
  const apiBase = getValue("API");
  const url = `${apiBase}memberships/plans/${planId}/visibility`;

  const res = await patchPlanVisibility(url, visibility, jwt);

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      "❌ Failed to update membership plan visibility:",
      res.status,
      errorText
    );
    throw new Error("Failed to update membership plan visibility");
  }

  // Some environments may respond with 204 (no content).
  if (res.status === 204) {
    return;
  }

  // Attempt to parse the response for completeness, but swallow JSON errors
  // since callers do not currently rely on the payload.
  try {
    const updatedPlan: MembershipPlanResponseLike = await res.json();
    mapMembershipPlan(updatedPlan);
  } catch (error) {
    console.warn(
      "⚠️ Membership plan visibility updated but response was empty or invalid.",
      error
    );
  }
}

export async function getAllMembershipPlans(): Promise<
  MembershipPlanWithMembershipName[]
> {
  const memberships = await getAllMemberships();

  const plansByMembership = await Promise.all(
    memberships.map(async (membership) => {
      const plans = await getPlansForMembership(membership.id);
      return plans.map((plan) => ({
        ...plan,
        membershipName: membership.name,
      }));
    })
  );

  return plansByMembership.flat();
}
