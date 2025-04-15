import { StaffRoleEnum, User } from "@/types/user";
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";
import { IdentityUserAuthenticationResponseDto } from "@/app/api/Api";

/**
 * Authenticates a user with a Firebase token by making a request to the backend auth endpoint.
 * Converts the backend response into a standardized User object with role mapping.
 * 
 * @param {string} firebaseToken - The Firebase authentication token
 * @returns {Promise<User>} A promise that resolves to a User object containing auth data
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
export const loginWithFirebaseToken = async (firebaseToken: string): Promise<User> => {
  try {

    const response = await fetch(`${getValue('API')}auth`, {
      method: 'POST',
      ...addAuthHeader(firebaseToken),
    });

    const headerKeys = [...response.headers.keys()];
    const authHeaderKey = headerKeys.find(key =>
      key.toLowerCase() === 'authorization'
    );

    // Get the JWT token from headers
    const authHeader = authHeaderKey ? response.headers.get(authHeaderKey) || "" : "";
    const jwtToken = authHeader.replace("Bearer ", "");

    // Get response body
    const data: IdentityUserAuthenticationResponseDto = await response.json()

    let role: StaffRoleEnum

    switch (data.role?.toUpperCase()) {
      case 'ADMIN':
        role = StaffRoleEnum.ADMIN
        break;
      case 'BARBER':
        role = StaffRoleEnum.BARBER
        break;
      case 'SUPERADMIN':
        role = StaffRoleEnum.SUPERADMIN
        break;
      case 'COACH':
        role = StaffRoleEnum.COACH
        break;
      case 'INSTRUCTOR':
        role = StaffRoleEnum.INSTRUCTOR
        break;
      default:
        throw new Error("Invalid role type")
    }

    const user: User = {
      ID: data.id!,
      Email: data.email || '', // Email might not be in response
      Name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      StaffInfo: {
        Role: role,
        IsActive: data.is_active_staff || false,
      },
      Jwt: jwtToken,
      Phone: data.phone!,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    return user

  } catch (pathError) {
    console.log("Backend authentication failed, using dev mode");
    console.error("Authentication error:", pathError);

    throw new Error("Authentication or authorization failed");

  }
}