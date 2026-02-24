import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";

async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorData = await response.json();
      message = errorData.error?.message || errorData.message || errorData.error || message;
    } catch {
      // use statusText fallback
    }
    throw new Error(message);
  }
  return response.json();
}

/**
 * Cancel a subscription at the end of the current billing period (admin only)
 */
export async function cancelSubscription(
  subscriptionId: string,
  jwt: string
): Promise<any> {
  const url = `${getValue("API")}subscriptions/${subscriptionId}/cancel`;
  const response = await fetch(url, {
    method: "POST",
    ...addAuthHeader(jwt),
  });
  return handleResponse(response);
}

/**
 * Cancel a subscription immediately (admin only)
 */
export async function cancelSubscriptionImmediate(
  subscriptionId: string,
  jwt: string
): Promise<any> {
  const url = `${getValue("API")}subscriptions/${subscriptionId}/cancel/immediate`;
  const response = await fetch(url, {
    method: "POST",
    ...addAuthHeader(jwt),
  });
  return handleResponse(response);
}

/**
 * Pause a subscription (admin only)
 */
export async function pauseSubscription(
  subscriptionId: string,
  jwt: string,
  resumeAt?: string
): Promise<any> {
  let url = `${getValue("API")}subscriptions/${subscriptionId}/pause`;
  if (resumeAt) {
    url += `?resume_at=${encodeURIComponent(resumeAt)}`;
  }
  const response = await fetch(url, {
    method: "POST",
    ...addAuthHeader(jwt),
  });
  return handleResponse(response);
}

/**
 * Resume a paused subscription (admin only)
 */
export async function resumeSubscription(
  subscriptionId: string,
  jwt: string
): Promise<any> {
  const url = `${getValue("API")}subscriptions/${subscriptionId}/resume`;
  const response = await fetch(url, {
    method: "POST",
    ...addAuthHeader(jwt),
  });
  return handleResponse(response);
}

/**
 * Admin upgrade a customer's subscription to a higher-tier plan
 */
export async function adminUpgradeSubscription(
  subscriptionId: string,
  customerId: string,
  newPlanId: string,
  jwt: string
): Promise<any> {
  const url = `${getValue("API")}subscriptions/admin/${subscriptionId}/upgrade`;
  const response = await fetch(url, {
    method: "POST",
    ...addAuthHeader(jwt),
    body: JSON.stringify({
      new_plan_id: newPlanId,
      customer_id: customerId,
    }),
  });
  return handleResponse(response);
}

/**
 * Admin send a Stripe checkout link to assign a membership to a customer
 */
export async function adminSendCheckout(
  customerId: string,
  membershipPlanId: string,
  jwt: string
): Promise<{ checkout_url: string; message: string }> {
  const url = `${getValue("API")}subscriptions/admin/send-checkout`;
  const response = await fetch(url, {
    method: "POST",
    ...addAuthHeader(jwt),
    body: JSON.stringify({
      customer_id: customerId,
      membership_plan_id: membershipPlanId,
    }),
  });
  return handleResponse(response);
}
