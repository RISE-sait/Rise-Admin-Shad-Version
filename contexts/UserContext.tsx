"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/user";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/configs/firebase";
import { loginWithFirebaseToken } from "@/services/auth";

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user !== null) {

      if (pathname === '/login') {
        router.push('/');
        return;
      }
      return
    }

    // user is null

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {

      if (!firebaseUser) {
        setUser(null)
        if (pathname !== "/login") router.push("/login")
        return
      }

      try {
        // Refresh the ID token
        const idToken = await firebaseUser.getIdToken()

        const backendUser = await loginWithFirebaseToken(idToken)

        if (backendUser) {
          // Update user context
          setUser(backendUser)

          if (pathname === "/login") {
            router.push("/");
          }
        } else {
          console.error("Backend authentication failed, user is null")
        }
      } catch (error) {
        console.error("Error during authentication:", error)
      }
    })

    return () => unsubscribe();

  }, [router, pathname]);

  const logout = () => {

    // Update context state
    setUser(null);

    // Optional: Force a hard refresh for a clean state
    window.location.href = '/login';
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}