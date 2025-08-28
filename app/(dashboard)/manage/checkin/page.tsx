import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";
import CheckInPage from "@/components/checkin/CheckInPage";

export default function Page() {
  return (
    <RoleProtected
      allowedRoles={[StaffRoleEnum.SUPERADMIN, StaffRoleEnum.RECEPTIONIST]}
    >
      <CheckInPage />
    </RoleProtected>
  );
}
