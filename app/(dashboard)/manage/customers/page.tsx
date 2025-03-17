import CustomersPage from "@/components/customers/CustomerPage";
import { Customer } from "@/types/customer";
import getValue from "@/configs/constants";

export default async function ManageCustomersPage() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `/customers`);
  const customersResponse: Customer[] = await response.json();

  return (
    <div className="p-6 flex">
      <CustomersPage customers={customersResponse} />
    </div>
  );
}