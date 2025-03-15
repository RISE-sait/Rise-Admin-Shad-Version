"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/user";
import { checkAuthStatus } from "@/services/auth";

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await checkAuthStatus();
        setUser(userData);
        
        if (!userData && !pathname.startsWith('/login')) {
          router.push('/login');
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router, pathname]);

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {isLoading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
}