import { Api, UserUpdateRequestDto } from "@/app/api/Api";
import getValue from "@/configs/constants";

export interface EmailChangeResponse {
  message?: string;
  pending_email?: string;
}

export async function initiateEmailChange(
  userId: string,
  newEmail: string,
  jwt: string
): Promise<{ error: string | null; data?: EmailChangeResponse }> {
  try {
    const baseUrl = getValue("API").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/users/${userId}/email/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ new_email: newEmail }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        return { error: "Invalid email format" };
      }
      if (response.status === 403) {
        return { error: "Not authorized to change this email" };
      }
      if (response.status === 409) {
        return { error: "This email is already in use" };
      }
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData?.message || "Failed to initiate email change" };
    }

    const data = await response.json();
    return { error: null, data };
  } catch (error: any) {
    return { error: error?.message || "Failed to initiate email change" };
  }
}

export async function resendEmailChangeVerification(
  userId: string,
  jwt: string
): Promise<{ error: string | null }> {
  try {
    const baseUrl = getValue("API").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/users/${userId}/email/resend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData?.message || "Failed to resend verification email" };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error?.message || "Failed to resend verification email" };
  }
}

export async function cancelEmailChange(
  userId: string,
  jwt: string
): Promise<{ error: string | null }> {
  try {
    const baseUrl = getValue("API").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/users/${userId}/email/cancel`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData?.message || "Failed to cancel email change" };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error?.message || "Failed to cancel email change" };
  }
}

export async function updateUser(
  id: string,
  userData: UserUpdateRequestDto,
  jwt: string
): Promise<string | null> {
  try {
    const api = new Api<{ token: string }>({
      baseUrl: getValue("API").replace(/\/$/, ""),
      securityWorker: (securityData) =>
        securityData?.token
          ? { headers: { Authorization: `Bearer ${securityData.token}` } }
          : {},
    });

    api.setSecurityData({ token: jwt });

    const payload: UserUpdateRequestDto = { ...userData };
    if (payload.phone) {
      const digits = payload.phone.replace(/\D/g, "");
      payload.phone = digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
    }

    await api.users.usersUpdate(id, payload);

    return null;
  } catch (error: any) {
    console.error("Error updating user:", error);
    return error?.error?.message || error?.message || "Unknown error occurred";
  }
}
