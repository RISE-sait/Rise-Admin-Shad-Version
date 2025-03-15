import { User } from "@/types/user";
import { Api, IdentityUserAuthenticationResponseDto } from "@/app/api/Api";

// Create a singleton instance of the API client
export const apiClient = new Api<unknown>({
  baseUrl: "http://localhost:80" // Explicitly set base URL
});

const tryAuthentication = async (token: string): Promise<any> => {
  // Try different paths to find the right endpoint
  const possiblePaths = [
    "/auth", 
    "/api/auth",
    "/v1/auth",
    "/identity/auth"
  ];
  
  let lastError;
  for (const path of possiblePaths) {
    try {
      console.log(`Trying authentication at path: ${path}`);
      const response = await fetch(`http://localhost:80${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'firebase_token': token
        }
      });
      
      if (response.ok) {
        console.log(`Success with path: ${path}`);
        return response;
      }
      console.log(`Failed with path: ${path}, status: ${response.status}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
};

export const loginWithFirebaseToken = async (firebaseToken: string): Promise<{user: User; token: string}> => {
  try {
    console.log("Authenticating with Firebase token");
    
    // First try with our path discovery function
    try {
      const response = await tryAuthentication(firebaseToken);
      const data = await response.json();
      const jwtToken = response.headers.get("Authorization")?.replace("Bearer ", "") || "";
      
      console.log("Auth successful, received response:", data);
      
      const userData = data.data || data;
      const user: User = {
        Email: userData.email || '',
        Name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        StaffInfo: {
          Role: userData.role as any || 'INSTRUCTOR',
          IsActive: true
        }
      };
      
      return { user, token: jwtToken };
    } catch (pathError) {
      console.log("Path discovery failed, trying original method");
      
      // If path discovery fails, try the original method
      const response = await apiClient.auth.authCreate({
        headers: {
          "firebase_token": firebaseToken
        }
      });
      
      // Rest of original implementation
      const authHeader = response.headers.get("Authorization");
      const jwtToken = authHeader ? authHeader.replace("Bearer ", "") : "";
      
      const userData = response.data;
      const user: User = {
        Email: userData.email || '',
        Name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        StaffInfo: {
          Role: userData.role as any || 'INSTRUCTOR',
          IsActive: true
        }
      };
      
      return { user, token: jwtToken };
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const checkAuthStatus = async (): Promise<User | null> => {
  try {
    // For development purposes, we'll return a mock user
    // In production, you would validate the JWT token stored in localStorage
    return {
      Email: "user@example.com",
      Name: "Example User",
      StaffInfo: {
        Role: "ADMIN",
        IsActive: true
      }
    };
  } catch (error) {
    console.error("Auth check error:", error);
    localStorage.removeItem('jwtToken');
    return null;
  }
};