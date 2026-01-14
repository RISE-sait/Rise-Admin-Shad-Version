"use client";

import { useState, useEffect, useCallback } from "react";
import CustomerPage from "./CustomerPage";
import { Customer } from "@/types/customer";
import {
  archiveCustomer,
  unarchiveCustomer,
  getCustomerCredits,
  CustomerFiltersParams,
} from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface CustomersManagerProps {
  search: string;
  archivedSearch: string;
  customers: Customer[];
  archivedCustomers: Customer[];
  currentPage: number;
  pages: number;
  archivedCurrentPage: number;
  archivedPages: number;
  initialFilters?: CustomerFiltersParams;
}

export default function CustomersManager({
  search,
  archivedSearch,
  customers,
  archivedCustomers,
  currentPage,
  pages,
  archivedCurrentPage,
  archivedPages,
  initialFilters,
}: CustomersManagerProps) {
  const [activeList, setActiveList] = useState<Customer[]>(customers);
  const [archivedList, setArchivedList] =
    useState<Customer[]>(archivedCustomers);

  const { user } = useUser();
  const { toast } = useToast();

  const jwt = user?.Jwt;

  const fetchCreditsForList = useCallback(
    async (list: Customer[]) => {
      if (!list.length) {
        return [];
      }

      if (!jwt) {
        return list.map((customer) => ({ ...customer }));
      }

      const results = await Promise.allSettled(
        list.map((customer) => getCustomerCredits(customer.id, jwt))
      );

      return list.map((customer, index) => {
        const result = results[index];
        const updated: Customer = { ...customer };

        if (result.status === "fulfilled") {
          if (typeof result.value === "number") {
            updated.credits = result.value;
          } else {
            updated.credits = undefined;
          }
        } else {
          console.error(
            `Failed to load credits for customer ${customer.id}:`,
            result.reason
          );
        }

        return updated;
      });
    },
    [jwt]
  );

  useEffect(() => {
    let isCancelled = false;

    const syncActive = async () => {
      const updated = await fetchCreditsForList(customers);
      if (isCancelled) return;

      setActiveList(updated);
    };

    setActiveList(customers.map((customer) => ({ ...customer })));
    syncActive();

    return () => {
      isCancelled = true;
    };
  }, [customers, fetchCreditsForList]);

  useEffect(() => {
    let isCancelled = false;

    const syncArchived = async () => {
      const updated = await fetchCreditsForList(archivedCustomers);
      if (isCancelled) return;

      setArchivedList(updated);
    };

    setArchivedList(archivedCustomers.map((customer) => ({ ...customer })));
    syncArchived();

    return () => {
      isCancelled = true;
    };
  }, [archivedCustomers, fetchCreditsForList]);

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
        initialFilters={initialFilters}
      />
      <CustomerPage
        title="Archived Customers"
        isArchivedList
        searchTerm={archivedSearch}
        customers={archivedList}
        currentPage={archivedCurrentPage}
        totalPages={archivedPages}
        totalCount={archivedList.length}
        onUnarchiveCustomer={handleUnarchive}
      />
    </div>
  );
}
