import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  Subsidy,
  SubsidyProvider,
  SubsidyBalance,
  CreateSubsidyRequest,
  DeactivateSubsidyRequest,
  PaginatedSubsidiesResponse,
} from "@/types/subsidy";

/**
 * Get subsidies for a specific customer (admin endpoint)
 */
export async function getCustomerSubsidies(
  customerId: string,
  jwt: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedSubsidiesResponse> {
  try {
    const response = await fetch(
      `${getValue("API")}subsidies?customer_id=${customerId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer subsidies: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as PaginatedSubsidiesResponse;
  } catch (error) {
    console.error(`Error fetching subsidies for customer ${customerId}:`, error);
    throw error;
  }
}

/**
 * Get subsidy balance for a customer (customer endpoint)
 */
export async function getCustomerSubsidyBalance(
  customerId: string,
  jwt: string
): Promise<SubsidyBalance> {
  try {
    const response = await fetch(
      `${getValue("API")}subsidies/me/balance`,
      {
        method: "GET",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch subsidy balance: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as SubsidyBalance;
  } catch (error) {
    console.error(`Error fetching subsidy balance for customer ${customerId}:`, error);
    throw error;
  }
}

/**
 * Get a specific subsidy by ID
 */
export async function getSubsidyById(
  subsidyId: string,
  jwt: string
): Promise<Subsidy> {
  try {
    const response = await fetch(
      `${getValue("API")}subsidies/${subsidyId}`,
      {
        method: "GET",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch subsidy: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as Subsidy;
  } catch (error) {
    console.error(`Error fetching subsidy ${subsidyId}:`, error);
    throw error;
  }
}

/**
 * Get all subsidy providers
 */
export async function getSubsidyProviders(
  jwt: string,
  isActive?: boolean
): Promise<SubsidyProvider[]> {
  try {
    const queryParam = isActive !== undefined ? `?is_active=${isActive}` : "";
    const response = await fetch(
      `${getValue("API")}subsidies/providers${queryParam}`,
      {
        method: "GET",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch subsidy providers: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    // The API might return { data: [...] } or just [...]
    if (Array.isArray(data)) {
      return data as SubsidyProvider[];
    } else if (data.data && Array.isArray(data.data)) {
      return data.data as SubsidyProvider[];
    }
    return [] as SubsidyProvider[];
  } catch (error) {
    console.error("Error fetching subsidy providers:", error);
    throw error;
  }
}

/**
 * Create a new subsidy for a customer
 */
export async function createSubsidy(
  request: CreateSubsidyRequest,
  jwt: string
): Promise<Subsidy> {
  try {
    const response = await fetch(`${getValue("API")}subsidies`, {
      method: "POST",
      ...addAuthHeader(jwt),
      headers: {
        ...addAuthHeader(jwt).headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create subsidy: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as Subsidy;
  } catch (error) {
    console.error("Error creating subsidy:", error);
    throw error;
  }
}

/**
 * Deactivate a subsidy
 */
export async function deactivateSubsidy(
  subsidyId: string,
  request: DeactivateSubsidyRequest,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(
      `${getValue("API")}subsidies/${subsidyId}/deactivate`,
      {
        method: "POST",
        ...addAuthHeader(jwt),
        headers: {
          ...addAuthHeader(jwt).headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to deactivate subsidy: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Error deactivating subsidy ${subsidyId}:`, error);
    throw error;
  }
}

/**
 * Get subsidy summary/statistics
 */
export async function getSubsidySummary(jwt: string): Promise<any> {
  try {
    const response = await fetch(`${getValue("API")}subsidies/summary`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch subsidy summary: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching subsidy summary:", error);
    throw error;
  }
}
