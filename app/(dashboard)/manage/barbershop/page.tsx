"use client";

import RoleProtected from "@/components/RoleProtected";
import BarbershopPage from "@/components/Barbershop/BarberPage";

export default function BarbershopPageContainer() {
  return (
    <RoleProtected 
    allowedRoles={['ADMIN', 'SUPERADMIN', 'BARBER']} fallback={<h1 className="text-center text-2xl">Access Denied</h1>}>
      <BarbershopPage />
    </RoleProtected>
  );
}