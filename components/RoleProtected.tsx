// components/auth/RoleProtected.tsx
"use client";

import { useUser } from "@/contexts/UserContext";
import { StaffRole } from "@/types/user";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RoleProtectedProps {
  allowedRoles: StaffRole[];
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback UI instead of redirect
}

export default function RoleProtected({ 
  allowedRoles, 
  children, 
  fallback 
}: RoleProtectedProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.StaffInfo?.Role;
      const hasPermission = userRole && allowedRoles.includes(userRole);
      
      if (!hasPermission && !fallback) {
        router.push('/dashboard'); // Redirect to dashboard or access denied page
      }
    }
  }, [user, isLoading, allowedRoles, router, fallback]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user doesn't have permission and fallback is provided, show fallback
  if (!user?.StaffInfo?.Role || !allowedRoles.includes(user.StaffInfo.Role)) {
    return fallback || null;
  }

  // User has the required role
  return <>{children}</>;
}