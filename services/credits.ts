import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";

type CreditRequestOptions = {
  includeCustomerId?: boolean;
};

const FALLBACK_STATUS_CODES = new Set([404, 405, 501]);

const extractNumericValue = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const resolveCreditAmount = (payload: unknown): number => {
  if (typeof payload === "number") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const candidates = [
      (payload as Record<string, unknown>).credits,
      (payload as Record<string, unknown>).balance,
      (payload as Record<string, unknown>).credit_balance,
      (payload as Record<string, unknown>).amount,
    ];

    for (const candidate of candidates) {
      const resolved = extractNumericValue(candidate);
      if (typeof resolved === "number") {
        return resolved;
      }
    }
  }

  return 0;
};

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.clone().json();
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      const message =
        (record.error as Record<string, unknown> | undefined)?.message ||
        (record.message as string | undefined) ||
        (record.detail as string | undefined);
      if (typeof message === "string") {
        return message;
      }
    }
  } catch {
    // ignore JSON parse issues and fall back to text
  }

  try {
    const text = await response.clone().text();
    if (text) {
      return text;
    }
  } catch {
    // ignore text parsing errors as well
  }

  return response.statusText || "Request failed";
};

const handleError = async (
  baseMessage: string,
  response: Response
): Promise<never> => {
  const detail = await readErrorMessage(response);
  throw new Error(`${baseMessage}: ${detail}`);
};

const tryAdminCreditBalance = async (
  id: string,
  jwt: string
): Promise<number | undefined> => {
  const response = await fetch(
    `${getValue("API")}admin/customers/${id}/credits`,
    {
      method: "GET",
      ...addAuthHeader(jwt),
    }
  );

  if (response.ok) {
    const data = await response.json().catch(() => undefined);
    return resolveCreditAmount(data);
  }

  if (FALLBACK_STATUS_CODES.has(response.status)) {
    return undefined;
  }

  await handleError("Failed to fetch credits", response);
};

const trySecureCreditBalance = async (
  id: string,
  jwt: string,
  options: CreditRequestOptions
): Promise<number | undefined> => {
  const params = options.includeCustomerId
    ? new URLSearchParams({
        customer_id: id,
        customerId: id,
      })
    : null;
  const queryString = params ? `?${params.toString()}` : "";

  const response = await fetch(
    `${getValue("API")}secure/credits${queryString}`,
    {
      method: "GET",
      ...addAuthHeader(jwt),
    }
  );

  if (response.ok) {
    const data = await response.json().catch(() => undefined);
    return resolveCreditAmount(data);
  }

  if (FALLBACK_STATUS_CODES.has(response.status)) {
    return undefined;
  }

  await handleError("Failed to fetch credits", response);
};

export async function getCustomerCredits(
  id: string,
  jwt: string,
  options: CreditRequestOptions = {}
): Promise<number> {
  if (!jwt) {
    throw new Error("Authorization token is required to fetch credits");
  }

  const secureBalance = await trySecureCreditBalance(id, jwt, options);
  if (typeof secureBalance === "number") {
    return secureBalance;
  }

  const adminBalance = await tryAdminCreditBalance(id, jwt);
  if (typeof adminBalance === "number") {
    return adminBalance;
  }

  throw new Error("Credits endpoint is unavailable");
}

const buildMutationBody = (amount: number, description: string) => ({
  amount,
  description,
});

const performCreditMutation = async (
  endpoint: string,
  amount: number,
  description: string,
  jwt: string,
  action: "add" | "deduct"
): Promise<number> => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      `A positive credit amount is required to ${action} credits`
    );
  }

  const detail = description.trim();
  if (!detail) {
    throw new Error(`A description is required to ${action} credits`);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(buildMutationBody(amount, detail)),
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    await handleError(`Failed to ${action} credits`, response);
  }

  const data = await response.json().catch(() => undefined);
  return resolveCreditAmount(data);
};

export async function addCustomerCredits(
  id: string,
  amount: number,
  description: string,
  jwt: string
): Promise<number> {
  if (!jwt) {
    throw new Error("Authorization token is required to add credits");
  }

  return await performCreditMutation(
    `${getValue("API")}admin/customers/${id}/credits/add`,
    amount,
    description,
    jwt,
    "add"
  );
}

export async function deductCustomerCredits(
  id: string,
  amount: number,
  description: string,
  jwt: string
): Promise<number> {
  if (!jwt) {
    throw new Error("Authorization token is required to deduct credits");
  }

  return await performCreditMutation(
    `${getValue("API")}admin/customers/${id}/credits/deduct`,
    amount,
    description,
    jwt,
    "deduct"
  );
}

const tryAdminTransactions = async (
  id: string,
  jwt: string,
  offset: number,
  limit: number
): Promise<any | undefined> => {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });

  const response = await fetch(
    `${getValue("API")}admin/customers/${id}/credits/transactions?${params.toString()}`,
    {
      method: "GET",
      ...addAuthHeader(jwt),
    }
  );

  if (response.ok) {
    return await response.json().catch(() => ({}));
  }

  if (FALLBACK_STATUS_CODES.has(response.status)) {
    return undefined;
  }

  await handleError("Failed to fetch credit transactions", response);
};

const trySecureTransactions = async (
  id: string,
  jwt: string,
  offset: number,
  limit: number,
  options: CreditRequestOptions
): Promise<any | undefined> => {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });
  if (options.includeCustomerId) {
    params.append("customer_id", id);
    params.append("customerId", id);
  }

  const response = await fetch(
    `${getValue("API")}secure/credits/transactions?${params.toString()}`,
    {
      method: "GET",
      ...addAuthHeader(jwt),
    }
  );

  if (response.ok) {
    return await response.json().catch(() => ({}));
  }

  if (FALLBACK_STATUS_CODES.has(response.status)) {
    return undefined;
  }

  await handleError("Failed to fetch credit transactions", response);
};

export async function getCreditTransactions(
  id: string,
  jwt: string,
  { offset = 0, limit = 20 }: { offset?: number; limit?: number },
  options: CreditRequestOptions = {}
): Promise<any> {
  if (!jwt) {
    throw new Error(
      "Authorization token is required to fetch credit transactions"
    );
  }

  const secureTransactions = await trySecureTransactions(
    id,
    jwt,
    offset,
    limit,
    options
  );
  if (secureTransactions !== undefined) {
    return secureTransactions;
  }

  const adminTransactions = await tryAdminTransactions(id, jwt, offset, limit);
  if (adminTransactions !== undefined) {
    return adminTransactions;
  }

  throw new Error("Credit transactions endpoint is unavailable");
}
