import { Customer } from "@/types/customer";
import getValue from "@/configs/constants";
import {
  CustomerMembershipResponseDto,
  UserUpdateRequestDto,
} from "@/app/api/Api";
import { addAuthHeader } from "@/lib/auth-header";
import { getCustomerCredits } from "@/services/credits";

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
  phone: string;
  user_id: string;
  credits?: number;
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
    credits: response.credits ?? 0,
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

export async function getCustomers(
  search?: string,
  page: number = 1,
  limit: number = 20,
  jwt?: string
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

    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "Failed to fetch customers:",
        response.status,
        response.statusText
      );
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    const json: CustomersPaginatedResponse = await response.json();

    const includesCredits =
      json.data.length > 0 && (json.data[0] as any).credits !== undefined;
    const customers = json.data.map(mapApiResponseToCustomer);

    if (!includesCredits && jwt) {
      await Promise.all(
        customers.map(async (c) => {
          try {
            c.credits = await getCustomerCredits(c.id, jwt, {
              includeCustomerId: true,
            });
          } catch {
            c.credits = 0;
          }
        })
      );
    }

    return {
      customers,
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
  customerId: string,
  jwt?: string
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

    const customer = mapApiResponseToCustomer(customerResponse);

    if (customerResponse.credits === undefined && jwt) {
      try {
        customer.credits = await getCustomerCredits(customer.id, jwt, {
          includeCustomerId: true,
        });
      } catch {
        customer.credits = 0;
      }
    }

    return customer;
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

export async function getArchivedCustomers(
  search?: string,
  page: number = 1,
  limit: number = 20,
  jwt?: string
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
    let customers: Customer[] = [];
    if (Array.isArray(json)) {
      customers = json.map(mapApiResponseToCustomer);
    } else {
      customers = (json.data || []).map(mapApiResponseToCustomer);
    }

    const includesCredits = Array.isArray(json)
      ? json.length > 0 && (json[0] as any).credits !== undefined
      : (json.data || []).length > 0 &&
        (json.data![0] as any).credits !== undefined;
    if (!includesCredits && jwt) {
      await Promise.all(
        customers.map(async (c) => {
          try {
            c.credits = await getCustomerCredits(c.id, jwt, {
              includeCustomerId: true,
            });
          } catch {
            c.credits = 0;
          }
        })
      );
    }

    if (Array.isArray(json)) {
      return { customers, page: 1, pages: 1, total: json.length };
    }

    return {
      customers,
      page: json.page || 1,
      pages: json.pages || 1,
      total: json.total ?? (json.data ? json.data.length : 0),
    };
  } catch (error) {
    console.error("Error fetching archived customers:", error);
    throw error;
  }
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
