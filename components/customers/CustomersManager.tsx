"use client";

import { useState, useEffect } from "react";
import CustomerPage from "./CustomerPage";
import { Customer } from "@/types/customer";
import { archiveCustomer, unarchiveCustomer } from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface CustomersManagerProps {
  search: string;
  customers: Customer[];
  archivedCustomers: Customer[];
  currentPage: number;
  pages: number;
  archivedCurrentPage: number;
  archivedPages: number;
}

export default function CustomersManager({
  search,
  customers,
  archivedCustomers,
  currentPage,
  pages,
  archivedCurrentPage,
  archivedPages,
}: CustomersManagerProps) {
  const [activeList, setActiveList] = useState<Customer[]>(customers);
  const [archivedList, setArchivedList] =
    useState<Customer[]>(archivedCustomers);

  useEffect(() => {
    setActiveList(customers);
  }, [customers]);

  useEffect(() => {
    setArchivedList(archivedCustomers);
  }, [archivedCustomers]);

  const { user } = useUser();
  const { toast } = useToast();

  const handleArchive = async (id: string) => {
    if (!user) return;
    await archiveCustomer(id, user.Jwt);
    setActiveList((prev) => prev.filter((c) => c.id !== id));
    const moved = activeList.find((c) => c.id === id);
    if (moved) {
      setArchivedList((prev) => [{ ...moved, is_archived: true }, ...prev]);
    }
    toast({ status: "success", description: "Customer successfully archived" });
  };

  const handleUnarchive = async (id: string) => {
    if (!user) return;
    await unarchiveCustomer(id, user.Jwt);
    setArchivedList((prev) => prev.filter((c) => c.id !== id));
    const moved = archivedList.find((c) => c.id === id);
    if (moved) {
      setActiveList((prev) => [{ ...moved, is_archived: false }, ...prev]);
    }
    toast({
      status: "success",
      description: "Customer successfully unarchived",
    });
  };

  return (
    <div className="flex flex-col">
      <CustomerPage
        searchTerm={search}
        customers={activeList}
        currentPage={currentPage}
        totalPages={pages}
        totalCount={activeList.length}
        onArchiveCustomer={handleArchive}
      />
      <CustomerPage
        title="Archived Customers"
        isArchivedList
        searchTerm={search}
        customers={archivedList}
        currentPage={archivedCurrentPage}
        totalPages={archivedPages}
        totalCount={archivedList.length}
        onUnarchiveCustomer={handleUnarchive}
      />
    </div>
  );
}
