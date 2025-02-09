"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/identity/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        setUser(null);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (user === null) return null; // Prevent flickering before redirect

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
