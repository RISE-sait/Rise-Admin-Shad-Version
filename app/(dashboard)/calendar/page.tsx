"use client";

import CalendarPage from "@/components/calendar/CalendarPage";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";

const ALLOWED_ROLES: StaffRoleEnum[] = [
  StaffRoleEnum.ADMIN,
  StaffRoleEnum.SUPERADMIN,
  StaffRoleEnum.COACH,
  StaffRoleEnum.INSTRUCTOR,
  StaffRoleEnum.RECEPTIONIST,
];

export default function Calendar() {
  return (
    <RoleProtected allowedRoles={ALLOWED_ROLES}>
      <CalendarPage />
    </RoleProtected>
  );
}
