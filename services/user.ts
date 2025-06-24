import { UserUpdateRequestDto } from "@/app/api/Api";
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";

export async function updateUser(
  id: string,
  userData: UserUpdateRequestDto,
  jwt: string
): Promise<string | null> {
  try {
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
      let errorMessage = `Failed to update user: ${response.statusText}`;

      if (responseJSON.error) {
        errorMessage = responseJSON.error.message;
      } else if (responseJSON.message) {
        errorMessage = responseJSON.message;
      }

      return errorMessage;
    }

    return null;
  } catch (error) {
    console.error("Error updating user:", error);
    return error instanceof Error ? error.message : "Unknown error occurred";
  }
}
