import React from "react";
import { cookies } from "next/headers";
import CustomersManager from "@/components/customers/CustomersManager";
import { getCustomers, getArchivedCustomers } from "@/services/customer";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";

export const revalidate = 0;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const resolved = await searchParams;
  const search = resolved.search || "";
  const page = parseInt(resolved.page || "1", 10);

  const jwtToken =
    (await cookies()).get("jwt")?.value ??
    (await cookies()).get("token")?.value ??
    undefined;

  let customers: any[] = [];
  let currentPage = 1;
  let pages = 1;
  let archivedCustomers: any[] = [];
  let archivedCurrentPage = 1;
  let archivedPages = 1;

  if (jwtToken) {
    try {
      const result = await getCustomers(search, page, 20, jwtToken);
      customers = result.customers;
      currentPage = result.page;
      pages = result.pages;
    } catch (error) {
      console.error("Failed to load customers", error);
    }

    try {
      const archivedResult = await getArchivedCustomers(search, page, 20, jwtToken);
      archivedCustomers = archivedResult.customers;
      archivedCurrentPage = archivedResult.page;
      archivedPages = archivedResult.pages;
    } catch (error) {
      console.error("Failed to load archived customers", error);
    }
  }

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN, StaffRoleEnum.RECEPTIONIST, StaffRoleEnum.SUPERADMIN]}>
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
