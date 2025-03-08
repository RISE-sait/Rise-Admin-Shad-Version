import CustomersPage from "@/components/customers/CustomerPage";
import { Customer } from "@/types/customer";
import getValue from "@/components/Singleton";

export default async function ManageCustomersPage() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `/customers`);
  const customers: Customer[] = await response.json();

  return (
    <div className="p-6 flex">
      <CustomersPage customers={customers} />
    </div>
  );
}
