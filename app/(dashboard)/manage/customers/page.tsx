import React from "react";
import CustomersManager from "@/components/customers/CustomersManager";
import { getCustomers, getArchivedCustomers } from "@/services/customer";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const resolved = await searchParams;
  const search = resolved.search || "";
  const page = parseInt(resolved.page || "1", 10);

  const {
    customers,
    page: currentPage,
    pages,
  } = await getCustomers(search, page);

  const {
    customers: archivedCustomers,
    page: archivedCurrentPage,
    pages: archivedPages,
  } = await getArchivedCustomers(search, page);

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST]}>
      <CustomersManager
        search={search}
        customers={customers}
        archivedCustomers={archivedCustomers}
        currentPage={currentPage}
        pages={pages}
        archivedCurrentPage={archivedCurrentPage}
        archivedPages={archivedPages}
      />
    </RoleProtected>
  );
}
