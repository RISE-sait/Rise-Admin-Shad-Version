"use client";

import RoleProtected from "@/components/RoleProtected";
import BarbershopPage from "@/components/Barbershop/BarberPage";
import { StaffRoleEnum } from "@/types/user";

export default function BarbershopPageContainer() {
  return (
    <RoleProtected
      allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]}>
      <BarbershopPage />
    </RoleProtected>
  );
}