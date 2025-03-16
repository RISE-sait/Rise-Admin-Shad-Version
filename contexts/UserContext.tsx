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
        
        // If user is not authenticated and not on the login page, redirect to login
        if (!userData && !pathname.includes('/login')) {
          router.push('/login');
        }
        // If user is authenticated and on the login page, redirect to home
        else if (userData && pathname.includes('/login')) {
          router.push('/');
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
    // Clear all authentication data
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    
    // Update context state
    setUser(null);
    
    // Redirect to login page
    router.push('/login');
    
    // Optional: Force a hard refresh for a clean state
     window.location.href = '/login';
  };

  // Don't render anything until auth check is complete for non-public routes
  if (isLoading && !pathname.includes('/login')) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
}