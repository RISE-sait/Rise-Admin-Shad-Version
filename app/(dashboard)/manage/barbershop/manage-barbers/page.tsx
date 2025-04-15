"use client";

import RoleProtected from "@/components/RoleProtected";
import ManageBarbersPage from "@/components/Barbershop/ManageBarbers";
import { StaffRoleEnum } from "@/types/user";

export default function ManageBarbersPageContainer() {
  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]}>
      <ManageBarbersPage />
    </RoleProtected>
  );
}