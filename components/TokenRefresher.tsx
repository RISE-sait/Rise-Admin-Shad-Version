"use client";

import { useEffect } from "react";
import { auth } from "@/configs/firebase";
import { loginWithFirebaseToken } from "@/services/auth";
import { useUser } from "@/contexts/UserContext";

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export default function TokenRefresher() {
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!user) return;

    const refreshJwt = async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!idToken) return;
        const updatedUser = await loginWithFirebaseToken(idToken);
        if (updatedUser) {
          localStorage.setItem("jwt", updatedUser.Jwt);
          setUser((prev) => {
            if (!prev) return updatedUser;
            return {
              ...prev,
              ...updatedUser,
              PhotoUrl: updatedUser.PhotoUrl ?? prev.PhotoUrl,
            };
          });
        }
      } catch (err) {
        console.error("Failed to refresh JWT", err);
      }
    };

    const interval = setInterval(refreshJwt, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [user, setUser]);

  return null;
}
