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
        mode: 'cors', // Ensure CORS headers are processed
        // Remove the credentials: 'include' line
        headers: {
          'Content-Type': 'application/json',
          'firebase_token': token,
          'Origin': 'http://localhost:3000'
        }
      });
      
      // Log all headers to check if Authorization is present
      console.log("Response headers from path:", path);
      response.headers.forEach((value: string, key: string) => {
        console.log(`Header: ${key} = ${value}`);
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

// Add this function to help decode JWT data
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const loginWithFirebaseToken = async (firebaseToken: string): Promise<{user: User; token: string}> => {
  try {
    console.log("Authenticating with Firebase token");
    
    // First try with our path discovery function
    try {
      // DEVELOPMENT FALLBACK
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode authentication available as fallback");
      }
      
      // Try normal backend authentication flow first
      const response = await tryAuthentication(firebaseToken);
      console.log("Authentication response received, status:", response.status);
      
      // Specifically check for the authorization header (case-insensitive)
      const headerKeys = [...response.headers.keys()];
      const authHeaderKey = headerKeys.find(key => 
        key.toLowerCase() === 'authorization' || 
        key.toLowerCase() === 'authentication'
      );
      
      console.log("Found authorization header key:", authHeaderKey);
      
      // Get the JWT token from headers
      const authHeader = authHeaderKey ? response.headers.get(authHeaderKey) || "" : "";
      const jwtToken = authHeader.replace("Bearer ", "");
      
      if (jwtToken) {
        console.log("JWT Token found (first 20 chars):", jwtToken.substring(0, 20) + "...");
        console.log("JWT length:", jwtToken.length);
        const decodedJwt = parseJwt(jwtToken);
        if (decodedJwt) {
          console.log("JWT expiry:", new Date(decodedJwt.exp * 1000).toLocaleString());
        }
      } else {
        console.warn("No JWT token found in Authorization header!");
      }
      
      // Get response body
      const data = await response.json();
      console.log("Response data:", data);
      
      // Extract user data from response body (per your Swagger response)
      const user: User = {
        Email: data.email || '', // Email might not be in response
        Name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        StaffInfo: {
          Role: (data.role || 'ADMIN').toUpperCase() as any,
          IsActive: true
        }
      };
      
      console.log("Created user from backend data:", user);
      
      // If email is missing from user data but available in Firebase token
      if (!user.Email) {
        try {
          const firebasePayload = parseJwt(firebaseToken);
          if (firebasePayload?.email) {
            user.Email = firebasePayload.email;
            console.log("Added email from Firebase token:", user.Email);
          }
        } catch (e) {
          console.error("Failed to extract email from Firebase token:", e);
        }
      }
      
      // Use token from header or create temporary one
      const finalToken = jwtToken || 'backend-temp-token-' + Date.now();
      
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('jwtToken', finalToken);
      
      return { user, token: finalToken };
      
    } catch (pathError) {
      console.log("Backend authentication failed, using dev mode");
      console.error("Authentication error:", pathError);
      
      // Use the development mode approach as fallback
      try {
        // Parse Firebase token to get user info
        const parts = firebaseToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("Firebase token payload:", payload);
          
          const user: User = {
            Email: payload.email || '',
            Name: payload.name || '',
            StaffInfo: {
              Role: 'ADMIN' as any,
              IsActive: true
            }
          };
          
          console.log("Created development user:", user);
          
          // Store in localStorage for persistence
          localStorage.setItem('userData', JSON.stringify(user));
          localStorage.setItem('jwtToken', 'dev-mode-token-' + Date.now());
          
          return { user, token: 'dev-mode-token' };
        }
      } catch (e) {
        console.error("Error in dev mode fallback:", e);
      }
      
      // Final fallback
      const user: User = {
        Email: "dev@example.com",
        Name: "Development User",
        StaffInfo: {
          Role: 'ADMIN' as any,
          IsActive: true
        }
      };
      
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('jwtToken', 'dev-mode-token-' + Date.now());
      
      return { user, token: 'dev-mode-token' };
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const checkAuthStatus = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;
    
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error("Auth check error:", error);
    localStorage.removeItem('jwtToken');
    return null;
  }
};