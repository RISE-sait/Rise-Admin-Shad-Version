import { auth } from "@/configs/firebase";
import { loginWithFirebaseToken } from "@/services/auth";

/**
 * Refreshes the JWT token by getting a new Firebase ID token and exchanging it for a backend JWT.
 * Updates localStorage and returns the new JWT.
 */
export async function refreshJwtToken(): Promise<string | null> {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    // Force refresh the Firebase token
    const idToken = await firebaseUser.getIdToken(true);
    if (!idToken) {
      return null;
    }

    // Exchange for backend JWT
    const backendUser = await loginWithFirebaseToken(idToken);
    if (!backendUser?.Jwt) {
      return null;
    }

    // Update localStorage
    localStorage.setItem("jwt", backendUser.Jwt);

    // Update cookie
    const isSecure = window.location.protocol === "https:";
    document.cookie = `jwt=${backendUser.Jwt}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax${isSecure ? "; Secure" : ""}`;

    return backendUser.Jwt;
  } catch (error) {
    console.error("Failed to refresh JWT token:", error);
    return null;
  }
}

/**
 * Gets the current JWT token from localStorage.
 */
export function getJwtToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("jwt");
}

/**
 * Makes an authenticated API request with automatic token refresh on 401.
 * If the initial request fails with 401, it will attempt to refresh the token and retry once.
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const jwt = getJwtToken();

  if (!jwt) {
    throw new Error("No authentication token available");
  }

  const makeRequest = async (token: string): Promise<Response> => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // First attempt
  let response = await makeRequest(jwt);

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const newJwt = await refreshJwtToken();

    if (newJwt) {
      // Retry with new token
      response = await makeRequest(newJwt);
    } else {
      // Token refresh failed - redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}

/**
 * Event that fires when the JWT token is refreshed.
 * Components can listen to this to update their local token references.
 */
export const JWT_REFRESHED_EVENT = "jwt-refreshed";

export function dispatchJwtRefreshedEvent(newJwt: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(JWT_REFRESHED_EVENT, { detail: { jwt: newJwt } })
    );
  }
}
