import React from 'react';
import CustomerPage from '@/components/customers/CustomerPage';
import { getAllCustomers } from '@/services/customer';

export default async function CustomersPageContainer() {

  const customers = await getAllCustomers();

  return (
    <div className="container">
      <CustomerPage
        customers={customers}
      />
    </div>
  );
}