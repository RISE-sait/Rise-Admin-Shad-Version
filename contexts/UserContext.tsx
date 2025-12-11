"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoggedInUser, StaffRoleEnum } from "@/types/user";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/configs/firebase";
import { loginWithFirebaseToken } from "@/services/auth";
import { getAllStaffs } from "@/services/staff";

type UserContextType = {
  user: LoggedInUser | null;
  setUser: React.Dispatch<React.SetStateAction<LoggedInUser | null>>;
  logout: () => void;
  isLoading: boolean; // Add this property
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user !== null) {
      if (pathname === "/login") {
        router.push(user.Role === StaffRoleEnum.COACH ? "/calendar" : "/");
        return;
      }
      setIsLoading(false); // Not loading once we have a user
      return;
    }

    // user is null
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      // Set loading to true while we process authentication
      setIsLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false); // Finished loading - no user
        if (pathname !== "/login") router.push("/login");
        return;
      }

      try {
        // Refresh the ID token
        const idToken = await firebaseUser.getIdToken();
        const backendUser = await loginWithFirebaseToken(idToken);

        if (backendUser) {
          // Update user context
          setUser(backendUser);
          if (pathname === "/login") {
            router.push(
              backendUser.Role === StaffRoleEnum.COACH ? "/calendar" : "/"
            );
          }
        }
      } catch {
        // Authentication failed
      } finally {
        setIsLoading(false); // Finished loading regardless of outcome
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  useEffect(() => {
    if (!user?.ID) return;
    if (user.PhotoUrl) return;

    let isMounted = true;

    const loadPhoto = async () => {
      try {
        const staffs = await getAllStaffs();
        if (!isMounted) return;
        const staffRecord = staffs.find((staff) => staff.ID === user.ID);
        if (!staffRecord?.PhotoUrl) return;

        setUser((prev) => {
          if (!prev) return prev;
          if (prev.PhotoUrl === staffRecord.PhotoUrl) return prev;
          return { ...prev, PhotoUrl: staffRecord.PhotoUrl };
        });
      } catch (error) {
        console.error("Failed to load user photo", error);
      }
    };

    loadPhoto();

    return () => {
      isMounted = false;
    };
  }, [user?.ID, user?.PhotoUrl, setUser]);

  const logout = () => {
    // Clear all auth data immediately
    localStorage.removeItem("jwt");
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Update context state
    setUser(null);

    // Redirect immediately to login
    router.replace("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
