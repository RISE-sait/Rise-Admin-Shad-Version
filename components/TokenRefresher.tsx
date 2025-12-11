"use client";

import { useEffect, useCallback, useRef } from "react";
import { auth } from "@/configs/firebase";
import { loginWithFirebaseToken } from "@/services/auth";
import { useUser } from "@/contexts/UserContext";

// Refresh every 5 minutes to stay ahead of token expiration
const REFRESH_INTERVAL = 5 * 60 * 1000;

// Minimum time between refreshes to prevent rapid fire
const MIN_REFRESH_INTERVAL = 30 * 1000; // 30 seconds

export default function TokenRefresher() {
  const { user, setUser, logout } = useUser();
  const lastRefreshRef = useRef<number>(0);
  const isRefreshingRef = useRef<boolean>(false);

  const refreshJwt = useCallback(async (force: boolean = false) => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) {
      return;
    }

    // Prevent too frequent refreshes unless forced
    const now = Date.now();
    if (!force && now - lastRefreshRef.current < MIN_REFRESH_INTERVAL) {
      return;
    }

    isRefreshingRef.current = true;

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        // No Firebase user - session might have expired
        console.warn("No Firebase user found during token refresh");
        return;
      }

      // Force refresh the Firebase ID token
      const idToken = await firebaseUser.getIdToken(true);
      if (!idToken) {
        console.warn("Failed to get Firebase ID token");
        return;
      }

      // Exchange for backend JWT
      const updatedUser = await loginWithFirebaseToken(idToken);
      if (!updatedUser?.Jwt) {
        console.warn("Failed to get backend JWT");
        return;
      }

      // Update localStorage
      localStorage.setItem("jwt", updatedUser.Jwt);

      // Update cookie for server-side access
      const isSecure = window.location.protocol === "https:";
      document.cookie = `jwt=${updatedUser.Jwt}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax${isSecure ? "; Secure" : ""}`;

      // Update user context (preserve photo URL if not in new response)
      setUser((prev) => {
        if (!prev) return updatedUser;
        return {
          ...prev,
          ...updatedUser,
          PhotoUrl: updatedUser.PhotoUrl ?? prev.PhotoUrl,
        };
      });

      // Dispatch event for other components that might need the new token
      window.dispatchEvent(
        new CustomEvent("jwt-refreshed", { detail: { jwt: updatedUser.Jwt } })
      );

      lastRefreshRef.current = Date.now();
    } catch (error) {
      console.error("Token refresh failed:", error);

      // If refresh fails completely, the user might need to re-login
      // Check if Firebase user is still valid
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        logout();
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [setUser, logout]);

  useEffect(() => {
    if (!user) return;

    // Initial refresh on mount
    refreshJwt(false);

    // Set up periodic refresh
    const interval = setInterval(() => refreshJwt(false), REFRESH_INTERVAL);

    // Refresh when tab becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshJwt(false);
      }
    };

    // Refresh when window gains focus
    const handleFocus = () => {
      refreshJwt(false);
    };

    // Refresh when coming back online
    const handleOnline = () => {
      refreshJwt(true); // Force refresh when coming back online
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
    };
  }, [user, refreshJwt]);

  return null;
}
