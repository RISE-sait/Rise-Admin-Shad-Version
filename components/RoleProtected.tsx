"use client"

import { useUser } from "@/contexts/UserContext";
import { StaffRole } from "@/types/user";
import { ReactNode } from "react";

interface RoleProtectedProps {
  allowedRoles: StaffRole[];
  children: ReactNode;
  fallback?: ReactNode
}

export default function RoleProtected({
  allowedRoles,
  children,
  fallback
}: RoleProtectedProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user doesn't have permission and fallback is provided, show fallback
  if (!user?.StaffInfo?.Role || !allowedRoles.includes(user.StaffInfo.Role)) {
    return fallback || <h1 className="text-center text-2xl">Access Denied</h1>
  }

  // User has the required role
  return <>{children}</>;
}