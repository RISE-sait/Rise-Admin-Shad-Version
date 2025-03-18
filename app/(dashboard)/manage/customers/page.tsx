"use client";
import React, { useState, useEffect } from 'react';
import CustomerPage from '@/components/customers/CustomerPage';
import { Customer } from '@/types/customer';
import { getAllCustomers } from '@/services/customer';
import { useToast } from "@/hooks/use-toast";

export default function CustomersPageContainer() {

  const { toast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCustomers();
      console.log(data)
      setCustomers(data);
      toast({ status: "success", description: "Customers loaded successfully" });
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


  return (
    <div className="container py-6 space-y-6">
      <CustomerPage
        customers={customers}
        isLoading={isLoading}
      />
    </div>
  );
}