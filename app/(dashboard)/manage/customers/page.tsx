import React from 'react';
import CustomerPage from '@/components/customers/CustomerPage';
import { getCustomers } from '@/services/customer';
import RoleProtected from '@/components/RoleProtected';
import { StaffRoleEnum } from '@/types/user';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {

  const search = (await searchParams).search || ''

  const customers = await getCustomers(search);

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className='flex'>
        <CustomerPage
        searchTerm={search}
          customers={customers}
        />
      </div>
    </RoleProtected>
  );
}