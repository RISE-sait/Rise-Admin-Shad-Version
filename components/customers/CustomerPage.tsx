"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Customer } from "../../types/customer";
import CustomerTable from "./CustomerTable";
import CustomerInfoPanel from "./CustomerInfoPanel";
import AddCustomerForm from "./AddCustomerForm";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CustomersPage({
  customers,
}: {
  customers: Customer[];
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<"details" | "add" | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogContent("details");
    setDialogOpen(true);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-xl mb-4">Customers</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-between gap-2 mb-4 w-full">
            <Input
              type="search"
              id="customersearch"
              placeholder="Search customers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                setDialogContent("add");
                setDialogOpen(true);
              }}
            >
              Add Customer
            </Button>
          </div>
        </div>
        <CustomerTable
          customers={filteredCustomers}
          onCustomerSelect={handleCustomerSelect}
        />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogContent === "details"
                ? "Customer Details"
                : "Add Customer"}
            </DialogTitle>
            <DialogDescription>
              {dialogContent === "details"
                ? "Manage & Update Customer Information"
                : "Add a New Customer"}
            </DialogDescription>
          </DialogHeader>
          {dialogContent === "details" && selectedCustomer && (
            <CustomerInfoPanel customer={selectedCustomer} />
          )}
          {dialogContent === "add" && <AddCustomerForm />}
        </DialogContent>
      </Dialog>
    </>
  );
}
