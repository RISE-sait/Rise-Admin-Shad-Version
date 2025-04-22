"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, Search } from "lucide-react";
import RightDrawer from "../reusable/RightDrawer";
import { Customer } from "@/types/customer";
import { Input } from "@/components/ui/input";
import CustomerTable from "./CustomerTable";
import CustomerInfoPanel from "./CustomerInfoPanel";
import AddCustomerForm from "./AddCustomerForm";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { columns } from "./CustomerTable";
import { VisibilityState } from "@tanstack/react-table";
import { AlertModal } from "@/components/ui/AlertModal";
import { useRouterQuery } from "@/hooks/router-query";

interface CustomerPageProps {
  searchTerm: string;
  customers: Customer[];
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function CustomersPage({ customers, searchTerm }: CustomerPageProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const { replace, val } = useRouterQuery({
    search: searchTerm,
  });

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleColumnVisibilityChange = (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => {
    setColumnVisibility((prev) => {
      const newState = typeof updater === "function" ? updater(prev) : updater;
      return { ...prev, ...newState };
    });
  };

  const handleBulkDelete = async () => {
    try {
      // Placeholder for bulk delete logic (e.g., API call)
      console.log("Deleting customers with IDs:", selectedIds);
      // await Promise.all(selectedIds.map(id => ApiService.customers.delete(id)));
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      // Add toast notification here if available (e.g., toast.success)
    } catch (error) {
      console.error("Error deleting customers:", error);
      // Add error toast notification here if available
    }
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Customers" description="Manage your customers and their details" />
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              debounce(() => replace({ search: e.target.value }), 30)()
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Columns
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((column) => (column as any).enableHiding !== false)
                .map((column) => {
                  const columnId = (column as any).id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className="capitalize"
                      checked={columnVisibility[columnId] ?? true}
                      onCheckedChange={(value) =>
                        handleColumnVisibilityChange((prev) => ({
                          ...prev,
                          [columnId]: value,
                        }))
                      }
                    >
                      {columnId}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setBulkDeleteOpen(true)}
              className="ml-4"
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <CustomerTable
        customers={customers}
        onCustomerSelect={handleCustomerSelect}
        onDeleteCustomer={() => { }}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <AlertModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={false} // Update with actual loading state if needed
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[25%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Customer Details" : "Add Customer"}
          </h2>
          {drawerContent === "details" && selectedCustomer && (
            <CustomerInfoPanel
              customer={selectedCustomer}
              onCustomerUpdated={() => { }}
              onCustomerDeleted={() => { }}
            />
          )}
          {drawerContent === "add" && (
            <AddCustomerForm
              onCustomerAdded={() => { }}
              onCancel={() => setDrawerOpen(false)}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}