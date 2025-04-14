import { useUser } from "@/contexts/UserContext";
import { StaffRole } from "@/types/user";

export function usePermissions() {
  const { user } = useUser();
  const userRole = user?.StaffInfo?.Role as StaffRole | undefined;

  return {
    isSuperAdmin: () => userRole === "SUPERADMIN",
    isAdmin: () => userRole === "ADMIN",
    isBarber: () => userRole === "BARBER",
    isCoach: () => userRole === "COACH",
    // ...add more as needed
    userRole,
  };
}