// CustomersPage.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ChevronDown, Loader2 } from "lucide-react";
import { columns } from "./CustomerTable";
import { VisibilityState } from "@tanstack/react-table";

// Update the props interface to match what's being passed from the page
interface CustomerPageProps {
  customers: Customer[];
}

export default function CustomersPage({
  customers,
}: CustomerPageProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleColumnVisibilityChange = (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
    setColumnVisibility(prev => {
      const newState = typeof updater === "function" ? updater(prev) : updater;
      return { ...prev, ...newState };
    });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto max-w-full">
        <h1 className="text-2xl font-semibold mb-6">Customers</h1>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Columns
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns
                  .filter(column => (column as any).enableHiding !== false)
                  .map((column) => {
                    const columnId = (column as any).id;
                    return (
                      <DropdownMenuCheckboxItem
                        key={columnId}
                        className="capitalize"
                        checked={columnVisibility[columnId] ?? true}
                        onCheckedChange={(value) =>
                          handleColumnVisibilityChange(prev => ({
                            ...prev,
                            [columnId]: value
                          }))
                        }
                      >
                        {columnId}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="default"
            onClick={() => {
              setDrawerContent("add");
              setDrawerOpen(true);
            }}
          >
            Add Customer
          </Button>
        </div>


        <CustomerTable
          customers={filteredCustomers}
          onCustomerSelect={handleCustomerSelect}
          onDeleteCustomer={() => { }}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
        />

      </div>

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
              onCustomerDeleted={() => { }} // FIX: Use the wrapper function with no parameters
            />
          )}
          {drawerContent === "add" && (
            <AddCustomerForm
              onCustomerAdded={() => { }} // FIX: Changed from onSuccess to onCustomerAdded
              onCancel={() => setDrawerOpen(false)}
            />
          )}
        </div>
      </RightDrawer>
    </>
  );
}