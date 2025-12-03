import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import {
  CreditPackage,
  CreditPackageRequest,
  CreditPackageResponse,
} from "@/types/credit-package";

async function parseErrorResponse(response: Response, fallbackMessage: string) {
  const responseText = await response.text();
  let errorMessage = fallbackMessage;
  const baseMessage = fallbackMessage.split(":")[0];

  if (responseText) {
    try {
      const errorData = JSON.parse(responseText);
      if (errorData?.error?.message) {
        errorMessage = `${baseMessage}: ${errorData.error.message}`;
      } else if (errorData?.message) {
        errorMessage = `${baseMessage}: ${errorData.message}`;
      } else if (errorData?.error) {
        errorMessage = `${baseMessage}: ${JSON.stringify(errorData.error)}`;
      }
      console.error("Error data:", errorData);
    } catch (error) {
      console.error("Raw error response:", responseText);
    }
  }

  throw new Error(errorMessage);
}

function mapCreditPackageResponse(
  creditPackage: CreditPackageResponse
): CreditPackage {
  return {
    ...creditPackage,
    description: creditPackage.description ?? undefined,
    created_at: new Date(creditPackage.created_at),
    updated_at: new Date(creditPackage.updated_at),
  };
}

export async function getAllCreditPackages(): Promise<CreditPackage[]> {
  try {
    const response = await fetch(`${getValue("API")}credit_packages`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch credit packages: ${response.statusText}`
      );
    }

    const creditPackages: CreditPackageResponse[] = await response.json();
    return creditPackages.map(mapCreditPackageResponse);
  } catch (error) {
    throw error;
  }
}

export async function getCreditPackage(id: string): Promise<CreditPackage> {
  try {
    const response = await fetch(`${getValue("API")}credit_packages/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch credit package: ${response.statusText}`);
    }

    const creditPackage: CreditPackageResponse = await response.json();
    return mapCreditPackageResponse(creditPackage);
  } catch (error) {
    throw error;
  }
}

export async function createCreditPackage(
  data: CreditPackageRequest,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(`${getValue("API")}credit_packages`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await parseErrorResponse(
        response,
        `Failed to create credit package: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error creating credit package:", error);
    throw error;
  }
}

export async function updateCreditPackage(
  id: string,
  data: CreditPackageRequest,
  jwt: string
): Promise<CreditPackageResponse | string | void> {
  try {
    const response = await fetch(`${getValue("API")}credit_packages/${id}`, {
      method: "PUT",
      ...addAuthHeader(jwt),
      body: JSON.stringify(data),
    });

    const responseText = await response.text();

    if (!response.ok) {
      await parseErrorResponse(
        response,
        `Failed to update credit package: ${response.statusText}`
      );
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  } catch (error) {
    console.error("Error updating credit package:", error);
    throw error;
  }
}

export async function deleteCreditPackage(
  id: string,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(`${getValue("API")}credit_packages/${id}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      await parseErrorResponse(
        response,
        `Failed to delete credit package: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error deleting credit package:", error);
    throw error;
  }
}
