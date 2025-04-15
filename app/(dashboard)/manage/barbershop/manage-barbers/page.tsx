"use client";

import ManageBarberServicesPage from "@/components/Barbershop/ManageBarberServices";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";

export default function ManageBarbersPageContainer() {
  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]}>
      <ManageBarberServicesPage />
    </RoleProtected>
  );
}