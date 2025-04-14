import { User } from "@/types/user";
import getValue from "@/configs/constants";

export const loginWithFirebaseToken = async (firebaseToken: string): Promise<User | null> => {
  try {

    const response = await fetch(`${getValue('API')}auth`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'accept': 'application/json',
      }
    });

    console.log("Authentication response received, status:", response.status);

    // Specifically check for the authorization header (case-insensitive)
    const headerKeys = [...response.headers.keys()];
    const authHeaderKey = headerKeys.find(key =>
      key.toLowerCase() === 'authorization'
    );

    console.log("Found authorization header key:", authHeaderKey);

    // Get the JWT token from headers
    const authHeader = authHeaderKey ? response.headers.get(authHeaderKey) || "" : "";
    const jwtToken = authHeader.replace("Bearer ", "");

    if (jwtToken) {
      console.log("JWT Token found (first 20 chars):", jwtToken.substring(0, 20) + "...");
      console.log("JWT length:", jwtToken.length)
    } else {
      console.warn("No JWT token found in Authorization header!");
    }

    // Get response body
    const data = await response.json();
    console.log("Response data:", data);

    // Extract user data from response body (per your Swagger response)
    const user = {
      Email: data.email || '', // Email might not be in response
      Name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      StaffInfo: {
        Role: (data.role || 'ADMIN').toUpperCase() as any,
        IsActive: true
      },
      Jwt: jwtToken
    };

    return user as User;

  } catch (pathError) {
    console.log("Backend authentication failed, using dev mode");
    console.error("Authentication error:", pathError);

    return null
  }
}