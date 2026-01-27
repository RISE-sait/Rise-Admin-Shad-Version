import React from "react";
import { cookies } from "next/headers";
import CustomersManager from "@/components/customers/CustomersManager";
import {
  getCustomers,
  getArchivedCustomers,
  CustomerFiltersParams,
} from "@/services/customer";
import RoleProtected from "@/components/RoleProtected";
import { StaffRoleEnum } from "@/types/user";

export const revalidate = 0;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    archivedSearch?: string;
    archivedPage?: string;
    // Filter params
    membership_plan_id?: string;
    has_membership?: string;
    has_credits?: string;
    min_credits?: string;
    max_credits?: string;
    subscription_status?: string;
  }>;
}) {
  const resolved = await searchParams;
  const search = resolved.search || "";
  const page = parseInt(resolved.page || "1", 10);
  const archivedSearch = resolved.archivedSearch || "";
  const archivedPage = parseInt(resolved.archivedPage || "1", 10);

  // Extract filter params
  const filters: CustomerFiltersParams = {
    membership_plan_id: resolved.membership_plan_id || "",
    has_membership: resolved.has_membership || "",
    has_credits: resolved.has_credits || "",
    min_credits: resolved.min_credits || "",
    max_credits: resolved.max_credits || "",
    subscription_status: resolved.subscription_status || "",
  };

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
      const result = await getCustomers(search, page, 10, jwtToken, filters);
      customers = result.customers;
      currentPage = result.page;
      pages = result.pages;
    } catch (error) {
      console.error("Failed to load customers", error);
    }

    try {
      const archivedResult = await getArchivedCustomers(archivedSearch, archivedPage, 10, jwtToken);
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
        archivedSearch={archivedSearch}
        customers={customers}
        archivedCustomers={archivedCustomers}
        currentPage={currentPage}
        pages={pages}
        archivedCurrentPage={archivedCurrentPage}
        archivedPages={archivedPages}
        initialFilters={filters}
      />
    </RoleProtected>
  );
}
