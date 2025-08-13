import { Api, UserUpdateRequestDto } from "@/app/api/Api";
import getValue from "@/configs/constants";

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
