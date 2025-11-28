"use client"

import { useUser } from "@/contexts/UserContext";
import { LoggedInUser, StaffRoleEnum } from "@/types/user";
import { ReactNode } from "react";

interface RoleProtectedProps {
  allowedRoles?: StaffRoleEnum[];
  children: ReactNode;
  fallback?: ReactNode
}

/**
 * A component that restricts access to content based on user roles.
 * SUPERADMIN and IT users are always granted access regardless of the allowedRoles.
 *
 * @param {Object} props
 * @param {StaffRoleEnum[]} [props.allowedRoles=[]] - Array of roles that are allowed to access the content
 * @param {ReactNode} props.children - The content to be protected
 * @param {ReactNode} [props.fallback] - Optional content to show when access is denied
 * @returns {ReactNode} Protected content if authorized, fallback or "Access Denied" if unauthorized
 */
export default function RoleProtected({
  allowedRoles = [],
  children,
  fallback
}: RoleProtectedProps): ReactNode {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isAuthorized = isUserAuthorized(user, allowedRoles)

  if (isAuthorized) return children

  return fallback || <h1 className="text-center text-2xl">Access Denied</h1>
}

function isUserAuthorized(user: LoggedInUser | null, allowedRoles: StaffRoleEnum[]) {

  if (user === null) return false

  const userRole = user.Role

  if (userRole === null) return false

  if (userRole === StaffRoleEnum.SUPERADMIN || userRole === StaffRoleEnum.IT) return true

  return allowedRoles.some((role) => role === userRole)
}