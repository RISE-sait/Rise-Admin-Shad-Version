import React from 'react';
import CustomerPage from '@/components/customers/CustomerPage';
import { getAllCustomers } from '@/services/customer';
import RoleProtected from '@/components/RoleProtected';

export default async function CustomersPageContainer() {

  const customers = await getAllCustomers();

  return (
    <RoleProtected allowedRoles={['ADMIN', 'SUPERADMIN']}>
    <div className='flex'>
      <CustomerPage
        customers={customers}
      />
    </div>
    </RoleProtected>
  );
}