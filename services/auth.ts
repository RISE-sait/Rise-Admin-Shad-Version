import { LoggedInUser, StaffRoleEnum } from "@/types/user";
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import { IdentityUserAuthenticationResponseDto } from "@/app/api/Api";

/**
 * Authenticates a user with a Firebase token by making a request to the backend auth endpoint.
 * Converts the backend response into a standardized LoggedInUser object with role mapping.
 *
 * @param {string} firebaseToken - The Firebase authentication token
 * @returns {Promise<LoggedInUser>} A promise that resolves to a LoggedInUser object containing auth data
 * @throws {Error} If authentication fails or if the role type is invalid
 *
 * @example
 * const firebaseToken = "...";
 * try {
 *   const user = await loginWithFirebaseToken(firebaseToken);
 *   // User is now authenticated
 * } catch (error) {
 *   // Handle authentication error
 * }
 */
export const loginWithFirebaseToken = async (
  firebaseToken: string
): Promise<LoggedInUser> => {
  try {
    const response = await fetch(`${getValue("API")}auth`, {
      method: "POST",
      ...addAuthHeader(firebaseToken),
    });

    const headerKeys = [...response.headers.keys()];
    const authHeaderKey = headerKeys.find(
      (key) => key.toLowerCase() === "authorization"
    );

    // Get the JWT token from headers
    const authHeader = authHeaderKey
      ? response.headers.get(authHeaderKey) || ""
      : "";
    const jwtToken = authHeader.replace("Bearer ", "");

    console.log("JWT Token:", jwtToken);

    // Get response body
    const data: IdentityUserAuthenticationResponseDto = await response.json();

    const roleKey = data.role?.toUpperCase() as
      | (typeof StaffRoleEnum)[keyof typeof StaffRoleEnum]
      | undefined;
    const role = roleKey ? StaffRoleEnum[roleKey] : undefined;

    if (role === undefined) {
      throw new Error("Invalid role type");
    }

    const photoUrl =
      (data as any)?.photo_url ||
      (data as any)?.photoUrl ||
      (data as any)?.photoURL ||
      (data as any)?.photo;

    const user: LoggedInUser = {
      ID: data.id!,
      Email: data.email || "", // Email might not be in response
      Name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      PhotoUrl: photoUrl ?? undefined,
      Role: role,
      IsActive: data.is_active_staff || false,
      Jwt: jwtToken,
      Phone: data.phone!,
      Dob: data.age || "",
      CountryAlpha2Code: data.country_code || "",
    };

    return user;
  } catch (pathError) {
    console.error("Authentication error:", pathError);

    throw new Error("Authentication or authorization failed");
  }
};
