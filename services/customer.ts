import { Customer, CustomerCreditTransaction } from "@/types/customer";
import getValue from "@/configs/constants";
import {
  CustomerMembershipResponseDto,
  UserUpdateRequestDto,
} from "@/app/api/Api";
import { addAuthHeader } from "@/lib/auth-header";

// Define a type for the API response
interface CustomerApiResponse {
  age: number;
  athlete_info?: {
    assists: number;
    losses: number;
    points: number;
    rebounds: number;
    steals: number;
    wins: number;
    photo_url?: string;
  };
  photo_url?: string;
  country_code?: string;
  email: string;
  first_name: string;
  hubspot_id?: string;
  is_archived?: boolean;
  last_name: string;
  membership_info?: {
    membership_name: string;
    membership_plan_id: string;
    membership_plan_name: string;
    membership_renewal_date: string;
    membership_start_date: string;
  };
  notes?: string | null;
  phone: string;
  user_id: string;
}

// Helper function to map API response to Customer type
function mapApiResponseToCustomer(response: CustomerApiResponse): Customer {
  const customer = {
    id: response.user_id,
    first_name: response.first_name,
    last_name: response.last_name,
    email: response.email,
    phone: response.phone,
    profilePicture:
      response.athlete_info?.photo_url || response.photo_url || "",

    // Membership info fields - extract from nested object
    membership_name: response.membership_info?.membership_name || "",
    membership_start_date: response.membership_info?.membership_start_date
      ? new Date(response.membership_info.membership_start_date)
      : null,
    membership_plan_id: response.membership_info?.membership_plan_id || "",
    membership_plan_name: response.membership_info?.membership_plan_name || "",
    membership_renewal_date:
      response.membership_info?.membership_renewal_date || "",

    // Athlete info fields - extract from nested object
    assists: response.athlete_info?.assists || 0,
    losses: response.athlete_info?.losses || 0,
    points: response.athlete_info?.points || 0,
    rebounds: response.athlete_info?.rebounds || 0,
    steals: response.athlete_info?.steals || 0,
    wins: response.athlete_info?.wins || 0,

    // Additional fields not provided by API
    hubspot_id: response.hubspot_id || "",
    is_archived: response.is_archived || false,
    notes: typeof response.notes === "string" ? response.notes : null,
    updated_at: new Date(), // Default to current date
    create_at: new Date(), // Default to current date
  };

  return customer;
}

interface CustomersPaginatedResponse {
  data: CustomerApiResponse[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

export type CustomerCreditsResponse = {
  credit_balance?: number | string;
  credits?: number | string;
  balance?: number | string;
  available_credits?: number | string;
  remaining_credits?: number | string;
  current_balance?: number | string;
  total_credits?: number | string;
  data?: Record<string, unknown>;
  result?: Record<string, unknown>;
};

const parseCreditValue = (value: unknown): number | undefined => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const searchForCreditInObject = (
  source: Record<string, unknown>,
  visited = new WeakSet<object>()
): number | undefined => {
  if (visited.has(source)) {
    return undefined;
  }

  visited.add(source);

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "number" || typeof value === "string") {
      if (/credit|balance/i.test(key)) {
        const parsed = parseCreditValue(value);
        if (typeof parsed === "number") {
          return parsed;
        }
      }
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = searchForCreditInObject(
        value as Record<string, unknown>,
        visited
      );
      if (typeof nested === "number") {
        return nested;
      }
    }
  }

  return undefined;
};

const extractCreditsFromResponse = (
  response: CustomerCreditsResponse
): number | undefined => {
  const directCandidates = [
    response.credit_balance,
    response.credits,
    response.balance,
    response.available_credits,
    response.remaining_credits,
    response.current_balance,
    response.total_credits,
  ];

  for (const candidate of directCandidates) {
    const parsed = parseCreditValue(candidate);
    if (typeof parsed === "number") {
      return parsed;
    }
  }

  const nestedSources = [response.data, response.result];

  for (const source of nestedSources) {
    if (!source || typeof source !== "object") continue;
    const nested = source as Record<string, unknown>;
    const nestedCandidates = [
      nested.credit_balance,
      nested.credits,
      nested.balance,
      nested.available_credits,
      nested.remaining_credits,
      nested.current_balance,
      nested.total_credits,
    ];

    for (const candidate of nestedCandidates) {
      const parsed = parseCreditValue(candidate);
      if (typeof parsed === "number") {
        return parsed;
      }
    }
  }

  if (response && typeof response === "object") {
    const fallback = searchForCreditInObject(
      response as Record<string, unknown>
    );
    if (typeof fallback === "number") {
      return fallback;
    }
  }

  return undefined;
};

const unwrapPrimitiveValue = (value: unknown): unknown => {
  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;

  const validFlag =
    (typeof record.Valid === "boolean" && record.Valid === false) ||
    (typeof record.valid === "boolean" && record.valid === false);

  if (validFlag) {
    return undefined;
  }

  const candidateKeys = [
    "String",
    "string",
    "Value",
    "value",
    "Time",
    "time",
    "Timestamp",
    "timestamp",
    "Date",
    "date",
    "Int64",
    "int64",
    "Int32",
    "int32",
    "Float64",
    "float64",
    "Float32",
    "float32",
    "Bool",
    "bool",
  ];

  for (const key of candidateKeys) {
    if (key in record) {
      const candidate = record[key];
      if (candidate !== undefined && candidate !== null) {
        return unwrapPrimitiveValue(candidate);
      }
    }
  }

  return value;
};

const toTimestampString = (value: unknown): string | undefined => {
  const unwrapped = unwrapPrimitiveValue(value);

  if (unwrapped === null || unwrapped === undefined) {
    return undefined;
  }

  if (typeof unwrapped === "string") {
    const trimmed = unwrapped.trim();
    return trimmed ? trimmed : undefined;
  }

  if (unwrapped instanceof Date) {
    return unwrapped.toISOString();
  }

  if (typeof unwrapped === "number" && Number.isFinite(unwrapped)) {
    return new Date(unwrapped).toISOString();
  }

  return undefined;
};

const extractTransactionsFromPayload = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const container = payload as Record<string, unknown>;
  const directKeys = ["data", "transactions", "records", "items", "results"];

  for (const key of directKeys) {
    const candidate = container[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  const nestedContainers = ["result", "payload", "meta"];
  for (const key of [...directKeys, ...nestedContainers]) {
    const candidate = container[key];
    if (!candidate || typeof candidate !== "object") {
      continue;
    }

    const nested = candidate as Record<string, unknown>;
    for (const nestedKey of directKeys) {
      const nestedValue = nested[nestedKey];
      if (Array.isArray(nestedValue)) {
        return nestedValue;
      }
    }
  }

  for (const value of Object.values(container)) {
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

const normalizeTransactionEntry = (
  entry: unknown,
  index: number,
  context: { customerId: string; offset?: number }
): CustomerCreditTransaction | null => {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const offsetBase = context.offset ?? 0;

  const idSource =
    record.id ??
    record.transaction_id ??
    record.transactionId ??
    record.uuid ??
    record._id;

  const createdAtSource =
    record.createdAt ??
    record.created_at ??
    record.timestamp ??
    record.datetime ??
    record.date;

  const amountSource =
    record.amount ??
    record.value ??
    record.change ??
    record.delta ??
    record.amount_change;
  const balanceSource =
    record.balanceAfter ??
    record.balance_after ??
    record.balance ??
    record.remaining ??
    record.current_balance ??
    record.postBalance ??
    record.balanceAfterChange;

  const normalizedAmount = parseCreditValue(unwrapPrimitiveValue(amountSource));
  const normalizedBalance = parseCreditValue(
    unwrapPrimitiveValue(balanceSource)
  );

  const descriptionSource =
    record.description ??
    record.reason ??
    record.note ??
    record.message ??
    record.details;
  const typeSource =
    record.type ?? record.action ?? record.direction ?? record.kind;

  const rawDescription = unwrapPrimitiveValue(descriptionSource);
  const rawType = unwrapPrimitiveValue(typeSource);

  const createdAt =
    toTimestampString(createdAtSource) ?? new Date().toISOString();
  const fallbackId = `${context.customerId}-tx-${offsetBase + index}`;

  const resolvedId =
    idSource !== undefined && idSource !== null
      ? (unwrapPrimitiveValue(idSource) ?? idSource)
      : undefined;

  const description =
    typeof rawDescription === "string"
      ? rawDescription.trim() || undefined
      : typeof rawDescription === "number" ||
          typeof rawDescription === "boolean"
        ? String(rawDescription)
        : undefined;

  const type =
    typeof rawType === "string"
      ? rawType.trim() || undefined
      : typeof rawType === "number" || typeof rawType === "boolean"
        ? String(rawType)
        : undefined;

  return {
    id: resolvedId !== undefined ? String(resolvedId) : fallbackId,
    created_at: createdAt,
    amount: normalizedAmount ?? 0,
    balanceAfter: normalizedBalance ?? undefined,
    description,
    type,
  };
};

const parseResponsePayload = (rawText: string): Record<string, unknown> => {
  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    return { message: rawText } as Record<string, unknown>;
  }
};

const extractErrorMessageFromPayload = (
  payload: Record<string, unknown>
): string | undefined => {
  if (typeof payload.error === "string") {
    return payload.error;
  }

  if (
    payload.error &&
    typeof payload.error === "object" &&
    payload.error !== null
  ) {
    const nestedError = payload.error as Record<string, unknown>;
    if (typeof nestedError.message === "string") {
      return nestedError.message;
    }
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const first = payload.errors[0];
    if (typeof first === "string") {
      return first;
    }

    if (first && typeof first === "object") {
      const nestedFirst = first as Record<string, unknown>;
      if (typeof nestedFirst.message === "string") {
        return nestedFirst.message;
      }
    }
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  return undefined;
};

export interface CustomerCreditsMutationResult {
  balance?: number;
  response: CustomerCreditsResponse;
}

const handleCreditsMutationResponse = async (
  response: Response,
  fallbackMessage: string
): Promise<CustomerCreditsMutationResult> => {
  const rawText = await response.text();
  const payload = parseResponsePayload(rawText);

  if (!response.ok) {
    const message =
      extractErrorMessageFromPayload(payload) ??
      `${fallbackMessage}: ${response.status} ${response.statusText}`.trim();
    throw new Error(message);
  }

  const parsedPayload = payload as CustomerCreditsResponse;
  const credits = extractCreditsFromResponse(parsedPayload);

  return {
    balance: credits,
    response: parsedPayload,
  };
};

const mutateCustomerCredits = async (
  id: string,
  amount: number,
  description: string,
  jwt: string,
  action: "add" | "deduct"
): Promise<CustomerCreditsMutationResult> => {
  if (!Number.isFinite(amount) || amount === 0) {
    throw new Error("Amount must be a positive number.");
  }

  const normalizedAmount = Math.abs(amount);
  const normalizedDescription = description.trim();

  if (!normalizedDescription) {
    throw new Error("Description is required.");
  }

  const response = await fetch(
    `${getValue("API")}admin/customers/${id}/credits/${action}`,
    {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify({
        amount: normalizedAmount,
        description: normalizedDescription,
      }),
    }
  );

  const fallbackMessage =
    action === "add"
      ? "Failed to add customer credits"
      : "Failed to deduct customer credits";

  return handleCreditsMutationResponse(response, fallbackMessage);
};

export async function getCustomerCreditTransactions(
  customerId: string,
  jwt: string,
  pagination: { limit?: number; offset?: number } = {}
): Promise<CustomerCreditTransaction[]> {
  if (!customerId) {
    return [];
  }

  if (!jwt) {
    throw new Error(
      "Authentication token is required to fetch credit transactions."
    );
  }

  const sanitizedLimit =
    typeof pagination.limit === "number" && Number.isFinite(pagination.limit)
      ? Math.max(1, Math.floor(pagination.limit))
      : undefined;

  const sanitizedOffset =
    typeof pagination.offset === "number" && Number.isFinite(pagination.offset)
      ? Math.max(0, Math.floor(pagination.offset))
      : undefined;

  const baseUrl = `${getValue("API")}admin/customers/${encodeURIComponent(
    customerId
  )}/credits/transactions`;
  const url = new URL(baseUrl);

  if (typeof sanitizedLimit === "number") {
    url.searchParams.set("limit", String(sanitizedLimit));
  }

  if (typeof sanitizedOffset === "number") {
    url.searchParams.set("offset", String(sanitizedOffset));
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    // If the response is 404, it likely means no transactions exist for this user
    // This is a valid state, not an error
    if (response.status === 404) {
      return [];
    }

    throw new Error(
      `Failed to fetch credit transactions: ${response.status} ${response.statusText}`.trim()
    );
  }

  const payload = await response.json().catch(() => null);
  const rawTransactions = extractTransactionsFromPayload(payload);

  return rawTransactions
    .map((entry, index) =>
      normalizeTransactionEntry(entry, index, {
        customerId,
        offset: sanitizedOffset,
      })
    )
    .filter(
      (transaction): transaction is CustomerCreditTransaction =>
        transaction !== null
    );
}

export async function getCustomers(
  search?: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  customers: Customer[];
  page: number;
  pages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const offset = (page - 1) * limit;
    params.append("offset", String(offset));
    params.append("limit", String(limit));

    const url = `${getValue("API")}customers?${params.toString()}`;

    console.log(`🔍 Fetching customers from: ${url}`);
    const response = await fetch(url);

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch customers:",
        response.status,
        response.statusText,
        errorText
      );
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    const json: CustomersPaginatedResponse = await response.json();
    console.log(`✅ Fetched ${json.data.length} customers from page ${json.page}`);

    return {
      customers: json.data.map(mapApiResponseToCustomer),
      page: json.page,
      pages: json.pages,
      total: json.total,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(
  customerId: string
): Promise<Customer | null> {
  try {
    const url = `${getValue("API")}customers/id/${customerId}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (response.status === 404) {
      // Customer not found - return null without logging an error
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }

    const customerResponse: CustomerApiResponse = await response.json();

    return mapApiResponseToCustomer(customerResponse);
  } catch (error) {
    console.error(`Error fetching customer with ID ${customerId}:`, error);
    throw error;
  }
}

/**
 * Check in a customer and return membership information
 */
export async function checkInCustomer(
  id: string
): Promise<CustomerMembershipResponseDto | null> {
  try {
    const url = `${getValue("API")}customers/checkin/${id}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to check in customer: ${response.statusText}`);
    }

    const membershipInfo: CustomerMembershipResponseDto = await response.json();
    return membershipInfo;
  } catch (error) {
    console.error(`Error checking in customer with ID ${id}:`, error);
    throw error;
  }
}

export async function updateCustomer(
  id: string,
  userData: UserUpdateRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    // Ensure phone numbers always include the +1 prefix expected by the backend
    const payload: UserUpdateRequestDto = { ...userData };
    if (payload.phone) {
      const digits = payload.phone.replace(/\D/g, "");
      payload.phone = digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
    }

    const response = await fetch(`${getValue("API")}users/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseJSON = await response.json().catch(() => ({}));
      let errorMessage = `Failed to update customer: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      } else if (responseJSON.message) {
        errorMessage = responseJSON.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error updating customer:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}

export async function updateCustomerNotes(
  id: string,
  notes: string,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(`${getValue("API")}customers/${id}/notes`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      const responseJSON = await response.json().catch(() => ({}));
      let errorMessage =
        response.statusText || "Failed to update customer notes";

      if (typeof responseJSON === "object" && responseJSON !== null) {
        if (typeof (responseJSON as any).error?.message === "string") {
          errorMessage = (responseJSON as any).error.message;
        } else if (typeof (responseJSON as any).message === "string") {
          errorMessage = (responseJSON as any).message;
        }
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error updating customer notes:", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while updating customer notes."
        );
  }
}

export async function getArchivedCustomers(
  search?: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  customers: Customer[];
  page: number;
  pages: number;
  total: number;
}> {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const offset = (page - 1) * limit;
    params.append("offset", String(offset));
    params.append("limit", String(limit));

    const url = `${getValue("API")}customers/archived?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch archived customers: ${response.statusText}`
      );
    }

    const json = await response.json();

    // Support both paginated and plain array formats
    if (Array.isArray(json)) {
      return {
        customers: json.map(mapApiResponseToCustomer),
        page: 1,
        pages: 1,
        total: json.length,
      };
    }

    return {
      customers: (json.data || []).map(mapApiResponseToCustomer),
      page: json.page || 1,
      pages: json.pages || 1,
      total: json.total ?? (json.data ? json.data.length : 0),
    };
  } catch (error) {
    console.error("Error fetching archived customers:", error);
    throw error;
  }
}

export async function getCustomerCredits(
  id: string,
  jwt: string
): Promise<number | undefined> {
  try {
    const response = await fetch(
      `${getValue("API")}admin/customers/${id}/credits`,
      {
        method: "GET",
        ...addAuthHeader(jwt),
      }
    );

    if (response.status === 404) {
      return 0;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer credits: ${response.status} ${response.statusText}`
      );
    }

    const json: CustomerCreditsResponse = await response
      .json()
      .catch(() => ({}) as CustomerCreditsResponse);

    const credits = extractCreditsFromResponse(json);

    return credits ?? 0;
  } catch (error) {
    console.error(`Error fetching credits for customer ${id}:`, error);
    throw error;
  }
}

export async function addCustomerCredits(
  id: string,
  amount: number,
  description: string,
  jwt: string
): Promise<CustomerCreditsMutationResult> {
  return mutateCustomerCredits(id, amount, description, jwt, "add");
}

export async function deductCustomerCredits(
  id: string,
  amount: number,
  description: string,
  jwt: string
): Promise<CustomerCreditsMutationResult> {
  return mutateCustomerCredits(id, amount, description, jwt, "deduct");
}

export async function archiveCustomer(id: string, jwt: string): Promise<void> {
  const response = await fetch(`${getValue("API")}customers/${id}/archive`, {
    method: "POST",
    ...addAuthHeader(jwt),
  });
  if (!response.ok) {
    throw new Error(`Failed to archive customer: ${response.statusText}`);
  }
}

export async function unarchiveCustomer(
  id: string,
  jwt: string
): Promise<void> {
  const response = await fetch(`${getValue("API")}customers/${id}/unarchive`, {
    method: "POST",
    ...addAuthHeader(jwt),
  });
  if (!response.ok) {
    throw new Error(`Failed to unarchive customer: ${response.statusText}`);
  }
}

export async function exportCustomers(jwt: string): Promise<Blob> {
  try {
    console.log("📊 Fetching customers for export...");

    // Fetch all customers by paginating through all pages (max 20 per page)
    let allCustomers: Customer[] = [];
    let currentPage = 1;
    let totalPages = 1;

    // Fetch first page to get total pages
    console.log("📄 Fetching page 1...");
    const firstPageResult = await getCustomers("", 1, 20);
    allCustomers = firstPageResult.customers;
    totalPages = firstPageResult.pages;
    console.log(`✅ Page 1 fetched: ${firstPageResult.customers.length} customers, ${totalPages} total pages`);

    // Fetch remaining pages if any
    if (totalPages > 1) {
      console.log(`📄 Fetching remaining ${totalPages - 1} pages...`);
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const remainingResults = await Promise.all(
        remainingPages.map(page => getCustomers("", page, 20))
      );

      remainingResults.forEach(result => {
        allCustomers = allCustomers.concat(result.customers);
      });
      console.log(`✅ All pages fetched: ${allCustomers.length} total customers`);
    }

    console.log("📝 Converting to CSV...");

    // Convert to CSV
    const csvHeaders = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Membership",
      "Membership Plan",
      "Credits",
      "Status"
    ];

    const csvRows = allCustomers.map(customer => [
      customer.first_name || "",
      customer.last_name || "",
      customer.email || "",
      customer.phone || "",
      customer.membership_name || "",
      customer.membership_plan_name || "",
      customer.credits?.toString() || "0",
      customer.is_archived ? "Archived" : "Active"
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      csvHeaders.map(escapeCsvValue).join(','),
      ...csvRows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    console.log("✅ CSV created successfully");
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  } catch (error) {
    console.error("❌ Export customers error:", error);
    throw error;
  }
}

export async function exportArchivedCustomers(jwt: string): Promise<Blob> {
  try {
    console.log("📊 Fetching archived customers for export...");

    // Fetch all archived customers by paginating through all pages (max 20 per page)
    let allCustomers: Customer[] = [];
    let currentPage = 1;
    let totalPages = 1;

    // Fetch first page to get total pages
    console.log("📄 Fetching page 1...");
    const firstPageResult = await getArchivedCustomers("", 1, 20);
    allCustomers = firstPageResult.customers;
    totalPages = firstPageResult.pages;
    console.log(`✅ Page 1 fetched: ${firstPageResult.customers.length} archived customers, ${totalPages} total pages`);

    // Fetch remaining pages if any
    if (totalPages > 1) {
      console.log(`📄 Fetching remaining ${totalPages - 1} pages...`);
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const remainingResults = await Promise.all(
        remainingPages.map(page => getArchivedCustomers("", page, 20))
      );

      remainingResults.forEach(result => {
        allCustomers = allCustomers.concat(result.customers);
      });
      console.log(`✅ All pages fetched: ${allCustomers.length} total archived customers`);
    }

    console.log("📝 Converting to CSV...");

    // Convert to CSV
    const csvHeaders = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Membership",
      "Membership Plan",
      "Credits",
      "Status"
    ];

    const csvRows = allCustomers.map(customer => [
      customer.first_name || "",
      customer.last_name || "",
      customer.email || "",
      customer.phone || "",
      customer.membership_name || "",
      customer.membership_plan_name || "",
      customer.credits?.toString() || "0",
      "Archived"
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      csvHeaders.map(escapeCsvValue).join(','),
      ...csvRows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    console.log("✅ CSV created successfully");
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  } catch (error) {
    console.error("❌ Export archived customers error:", error);
    throw error;
  }
}
