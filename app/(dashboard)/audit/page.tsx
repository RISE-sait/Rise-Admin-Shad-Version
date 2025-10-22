import { cookies } from "next/headers";
import RoleProtected from "@/components/RoleProtected";
import AuditPage from "@/components/audit/AuditPage";
import { getStaffActivityLogs } from "@/services/staff";
import { StaffRoleEnum } from "@/types/user";
import { StaffActivityLogsResult } from "@/types/staff-activity-log";

export const revalidate = 0;

export default async function Page() {
  let initialData: StaffActivityLogsResult = { logs: [], total: 0 };

  const jwtToken =
    (await cookies()).get("jwt")?.value ??
    (await cookies()).get("token")?.value ??
    undefined;

  if (jwtToken) {
    try {
      initialData = await getStaffActivityLogs(
        { limit: 10, offset: 0 },
        jwtToken
      );
    } catch (error) {
      console.error("Failed to load initial staff activity logs", error);
    }
  }

  return (
    <RoleProtected
      allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.SUPERADMIN]}
    >
      <AuditPage initialData={initialData} />
    </RoleProtected>
  );
}
