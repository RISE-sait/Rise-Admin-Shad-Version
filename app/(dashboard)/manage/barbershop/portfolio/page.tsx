"use client";

import RoleProtected from "@/components/RoleProtected";
import PortfolioPage from "@/components/Barbershop/Portfolio";

export default function PortfolioPageContainer() {
  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN', 'BARBER']}>
      <PortfolioPage />
    </RoleProtected>
  );
}