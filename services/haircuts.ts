import {
  HaircutEventEventResponseDto,
  HaircutEventRequestDto,
} from "@/app/api/Api";
import { addAuthHeader } from "@/lib/auth-header";
import getValue from "@/configs/constants";

// Get haircut images with optional filtering by barber
export async function getHaircuts(barber_id?: string): Promise<string[]> {
  try {
    const url = barber_id
      ? `${getValue("API")}haircuts?barber_id=${barber_id}`
      : `${getValue("API")}haircuts`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch haircuts: ${response.statusText}`);
    }

    const urls: string[] = await response.json();

    // Filter out any folder-level URL ending in /haircut or /haircut/
    return urls.filter((url) => !url.match(/\/haircut\/?$/));
  } catch (error) {
    console.error("Error fetching haircuts:", error);
    throw error;
  }
}

export async function uploadHaircut(
  file: File,
  jwt: string
): Promise<Record<string, string>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Don't include the Content-Type header when using FormData
    // The browser will set it automatically with the correct boundary
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    const response = await fetch(`${getValue("API")}haircuts`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      // Better error handling - get the response text
      const errorText = await response.text();
      console.error("Upload error response:", errorText);

      try {
        // Try to parse as JSON for structured error
        const errorJson = JSON.parse(errorText);
        throw new Error(
          `Failed to upload haircut: ${errorJson.message || response.statusText}`
        );
      } catch (e) {
        // If not JSON or parsing fails, use the raw text
        throw new Error(
          `Failed to upload haircut: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
    }

    return response.json();
  } catch (error) {
    console.error("Error uploading haircut:", error);
    throw error;
  }
}

// Get haircut events with optional filtering
export async function getHaircutEvents(params?: {
  after?: string;
  before?: string;
  barber_id?: string;
  customer_id?: string;
}): Promise<HaircutEventEventResponseDto[]> {
  try {
    // Set default time range if none provided
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    // Build URL with query parameters
    const queryParams = new URLSearchParams();

    // Always include date range (required by API)
    queryParams.append("after", params?.after || formatDate(thirtyDaysAgo));
    queryParams.append("before", params?.before || formatDate(thirtyDaysLater));

    // Add optional filters
    if (params?.barber_id) {
      queryParams.append("barber_id", params.barber_id);
    }

    if (params?.customer_id) {
      queryParams.append("customer_id", params.customer_id);
    }

    const url = `${getValue("API")}haircuts/events?${queryParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch haircut events: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching haircut events:", error);
    throw error;
  }
}

// Create a new haircut event
export async function createHaircutEvent(
  event: HaircutEventRequestDto,
  jwt: string
): Promise<HaircutEventEventResponseDto> {
  try {
    const response = await fetch(`${getValue("API")}haircuts/events`, {
      method: "POST",
      ...addAuthHeader(jwt),
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const responseText = await response.text();

      let errorMessage = `Failed to create haircut event: ${response.statusText}`;

      try {
        const errorData = JSON.parse(responseText);
        if (errorData?.error?.message) {
          errorMessage = `Failed to create haircut event: ${errorData.error.message}`;
        }
      } catch (e) {
        console.error("Raw error response:", responseText);
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating haircut event:", error);
    throw error;
  }
}

// Get a specific haircut event by ID
export async function getHaircutEventById(
  id: string
): Promise<HaircutEventEventResponseDto> {
  try {
    const response = await fetch(`${getValue("API")}haircuts/events/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch haircut event: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching haircut event ${id}:`, error);
    throw error;
  }
}

// Delete a haircut event
export async function deleteHaircutEvent(
  id: string,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(`${getValue("API")}haircuts/events/${id}`, {
      method: "DELETE",
      ...addAuthHeader(jwt),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete haircut event: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting haircut event ${id}:`, error);
    throw error;
  }
}
