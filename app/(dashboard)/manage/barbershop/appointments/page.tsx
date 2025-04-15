"use client";

import RoleProtected from "@/components/RoleProtected";
import AppointmentsPage from "@/components/Barbershop/Appointments";
import { StaffRoleEnum } from "@/types/user";

export default function AppointmentsPageContainer() {
  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]}>
      <AppointmentsPage />
    </RoleProtected>
  );
}