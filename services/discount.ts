import { addAuthHeader } from "@/lib/auth-header";
import getValue from "@/configs/constants";
import {
  Discount,
  CreateDiscountRequest,
  UpdateDiscountRequest,
} from "@/types/discount";

export async function getAllDiscounts(jwt: string): Promise<Discount[]> {
  try {
    const response = await fetch(`${getValue("API")}discounts`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch discounts: ${response.statusText}`);
    }

    const discounts: Discount[] = await response.json();
    return discounts;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
}

export async function getDiscount(id: string, jwt: string): Promise<Discount> {
  try {
    const response = await fetch(`${getValue("API")}discounts/${id}`, {
      method: "GET",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch discount: ${response.statusText}`);
    }

    const discount: Discount = await response.json();
    return discount;
  } catch (error) {
    console.error("Error fetching discount:", error);
    throw error;
  }
}

export async function createDiscount(
  data: CreateDiscountRequest,
  jwt: string
): Promise<{ discount?: Discount; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}discounts`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.message || errorData?.error || `Failed to create discount: ${response.statusText}`;
      return { error: errorMessage };
    }

    const discount: Discount = await response.json();
    return { discount };
  } catch (error) {
    console.error("Error creating discount:", error);
    return { error: "An unexpected error occurred while creating the discount" };
  }
}

export async function updateDiscount(
  id: string,
  data: UpdateDiscountRequest,
  jwt: string
): Promise<{ discount?: Discount; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}discounts/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.message || errorData?.error || `Failed to update discount: ${response.statusText}`;
      return { error: errorMessage };
    }

    const discount: Discount = await response.json();
    return { discount };
  } catch (error) {
    console.error("Error updating discount:", error);
    return { error: "An unexpected error occurred while updating the discount" };
  }
}

export async function deleteDiscount(
  id: string,
  jwt: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${getValue("API")}discounts/${id}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.message || errorData?.error || `Failed to delete discount: ${response.statusText}`;
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting discount:", error);
    return { success: false, error: "An unexpected error occurred while deleting the discount" };
  }
}
