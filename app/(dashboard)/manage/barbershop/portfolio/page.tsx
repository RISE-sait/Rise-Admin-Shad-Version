"use client";

import RoleProtected from "@/components/RoleProtected";
import PortfolioPage from "@/components/Barbershop/Portfolio";
import { StaffRoleEnum } from "@/types/user";

export default function PortfolioPageContainer() {
  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.BARBER]}>
      <PortfolioPage />
    </RoleProtected>
  );
}