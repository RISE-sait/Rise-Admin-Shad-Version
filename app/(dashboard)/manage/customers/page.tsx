"use client";
import React, { useState, useEffect } from 'react';
import CustomerPage from '@/components/customers/CustomerPage';
import { Customer } from '@/types/customer';
import CustomerService from '@/services/customer';
import { useToast } from "@/hooks/use-toast";

export default function CustomersPageContainer() {

  const { toast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const customerService = new CustomerService();

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data.map(customer => ({
        customer_id: customer.hubspot_id || '',
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        profilePicture: customer.profile_pic || '',
        user_id: customer.user_id || '',
        // Add the missing properties
        accountType: 'standard', // Default value or get from API if available
        membership: null,       // Default value
        attendance: [],         // Default empty array
        membership_renewal_date: null, // Default value
      })));
    } catch (error) {
      console.error('Error loading customers:', error);
      toast({ status: "error", description: "Failed to load customers" });
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCustomerUpdated = () => {
    loadCustomers();
  };

  const handleCustomerDeleted = () => {
    loadCustomers();
  };

  return (
    <div className="container py-6 space-y-6">
      <CustomerPage
        customers={customers}
        isLoading={isLoading}
        onCustomerUpdated={handleCustomerUpdated}
        onCustomerDeleted={handleCustomerDeleted}
      />
    </div>
  );
}