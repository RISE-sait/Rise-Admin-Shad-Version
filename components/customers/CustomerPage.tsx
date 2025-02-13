"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RightDrawer from "../reusable/RightDrawer"
import CustomerTable from "./CustomerTable"
// import CustomerDetail from "./InfoPanel"
// import AddCustomerForm from "./AddCustomerForm"
import { useDrawer } from "../../hooks/drawer"
import { Customer } from "../../types/customer"
import SearchBar from "../reusable/SearchBar"

export default function CustomersPage({ customers }: { customers: Customer[] }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer()

  const handleAddCustomer = (customer: Customer) => {
    // Add customer to the list (you might want to update the state or make an API call here)
    closeDrawer()
  }

  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id)
    openDrawer("details")
  }

  // Determine the title based on the drawer content
  const getDrawerTitle = () => {
    if (drawerContent === "add") return "Add Customer"
    if (drawerContent === "details") return "Customer Details"
    return "Sheet"
  }
  
  return (
    <div className="p-6 flex">
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Customers</h1>
        <div className="flex items-center gap-2 mb-4">
          <SearchBar placeholderText="Search Customers
          "/>
          <Button variant="outline" onClick={() => openDrawer("add")} className="ml-auto">
            Add Customer
          </Button>
        </div>
        <CustomerTable customers={customers} onCustomerSelect={handleCustomerSelect} />
      </div>
      {/* <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={closeDrawer}
      >
        {drawerContent === "details" && selectedCustomerId && (
          <CustomerDetail customerId={selectedCustomerId} onBack={closeDrawer} />
        )}
        {drawerContent === "add" && (
          <AddCustomerForm onAddCustomer={handleAddCustomer} />
        )}
      </RightDrawer> */}
    </div>
  )
}