import { addAuthHeader } from "@/lib/auth-header";
import getValue from "@/configs/constants";

export interface BarberAvailabilityRecord {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WeeklyAvailabilityResponse {
  barber_id?: string;
  barber_name?: string;
  availability?: BarberAvailabilityRecord[];
}

export interface SetAvailabilityRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

export interface UpdateAvailabilityRequest {
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

export async function getMyBarberAvailability(
  jwt: string
): Promise<WeeklyAvailabilityResponse> {
  try {
    const response = await fetch(
      `${getValue("API")}haircuts/barbers/me/availability`,
      {
        method: "GET",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch barber availability: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching barber availability:", error);
    throw error;
  }
}

export async function createBarberAvailability(
  payload: SetAvailabilityRequest,
  jwt: string
): Promise<BarberAvailabilityRecord> {
  try {
    const response = await fetch(
      `${getValue("API")}haircuts/barbers/me/availability`,
      {
        method: "POST",
        ...addAuthHeader(jwt),
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        message ||
          `Failed to create availability: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error creating barber availability:", error);
    throw error;
  }
}

export async function updateBarberAvailability(
  id: string,
  payload: UpdateAvailabilityRequest,
  jwt: string
): Promise<BarberAvailabilityRecord> {
  try {
    const response = await fetch(
      `${getValue("API")}haircuts/barbers/me/availability/${id}`,
      {
        method: "PUT",
        ...addAuthHeader(jwt),
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        message ||
          `Failed to update availability: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Error updating barber availability ${id}:`, error);
    throw error;
  }
}

export async function deleteBarberAvailability(
  id: string,
  jwt: string
): Promise<void> {
  try {
    const response = await fetch(
      `${getValue("API")}haircuts/barbers/me/availability/${id}`,
      {
        method: "DELETE",
        ...addAuthHeader(jwt),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        message ||
          `Failed to delete availability: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Error deleting barber availability ${id}:`, error);
    throw error;
  }
}
