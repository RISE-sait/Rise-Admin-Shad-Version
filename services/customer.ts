import { Customer } from "@/types/customer";
import getValue from "@/configs/constants";
import { UserUpdateRequestDto } from "@/app/api/Api";
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
  };
  country_code?: string;
  email: string;
  first_name: string;
  hubspot_id?: string;
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
}

// Helper function to map API response to Customer type
function mapApiResponseToCustomer(response: CustomerApiResponse): Customer {
  const customer = {
    id: response.user_id,
    first_name: response.first_name,
    last_name: response.last_name,
    email: response.email,
    phone: response.phone,
    profilePicture: "", // Default empty string as it's not provided by API

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
    params.append("page", String(page));
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
export async function getCustomerById(customerId: string): Promise<Customer> {
  try {
    const url = `${getValue("API")}customers/id/${customerId}`;
    console.log("Fetching customer by ID from URL:", url);

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch customer:",
        response.status,
        response.statusText
      );
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }

    const customerResponse: CustomerApiResponse = await response.json();
    console.log("Retrieved customer by ID:", customerResponse.user_id);

    // Map API response to Customer type
    return mapApiResponseToCustomer(customerResponse);
  } catch (error) {
    console.error(`Error fetching customer with ID ${customerId}:`, error);
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
