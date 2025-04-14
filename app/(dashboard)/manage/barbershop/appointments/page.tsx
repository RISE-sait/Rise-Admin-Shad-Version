"use client";

import RoleProtected from "@/components/RoleProtected";
import AppointmentsPage from "@/components/Barbershop/Appointments";

export default function AppointmentsPageContainer() {
  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN', 'BARBER']}>
      <AppointmentsPage />
    </RoleProtected>
  );
}