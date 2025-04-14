"use client";

import RoleProtected from "@/components/RoleProtected";
import BarbershopPage from "@/components/Barbershop/BarberPage";

export default function BarbershopPageContainer() {
  return (
    <RoleProtected 
    allowedRoles={['ADMIN', 'SUPERADMIN', 'BARBER']}>
      <BarbershopPage />
    </RoleProtected>
  );
}