import React from 'react';
import CustomerPage from '@/components/customers/CustomerPage';
import { getCustomers } from '@/services/customer';
import RoleProtected from '@/components/RoleProtected';
import { StaffRoleEnum } from '@/types/user';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const resolved = await searchParams;
  const search = resolved.search || '';
  const page = parseInt(resolved.page || '1', 10);

  const {
    customers,
    page: currentPage,
    pages,
    total
  } = await getCustomers(search, page);

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className="flex">
        <CustomerPage
          searchTerm={search}
          customers={customers}
          currentPage={currentPage}
          totalPages={pages}
          totalCount={total}
        />
      </div>
    </RoleProtected>
  );
}

