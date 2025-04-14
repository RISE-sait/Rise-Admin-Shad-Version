"use client";

import RoleProtected from "@/components/RoleProtected";
import ManageBarbersPage from "@/components/Barbershop/ManageBarbers";

export default function ManageBarbersPageContainer() {
  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN', 'BARBER']}>
      <ManageBarbersPage />
    </RoleProtected>
  );
}