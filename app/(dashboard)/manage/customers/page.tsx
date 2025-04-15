import React from 'react';
import CustomerPage from '@/components/customers/CustomerPage';
import { getAllCustomers } from '@/services/customer';
import RoleProtected from '@/components/RoleProtected';
import { StaffRoleEnum } from '@/types/user';

export default async function CustomersPageContainer() {

  const customers = await getAllCustomers();

  return (
    <RoleProtected allowedRoles={[StaffRoleEnum.ADMIN]}>
      <div className='flex'>
        <CustomerPage
          customers={customers}
        />
      </div>
    </RoleProtected>
  );
}