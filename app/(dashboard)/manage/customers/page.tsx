// import ClientsPage from "../../../../components/clients/ClientPage"
// import clientsData from "../../../../data/clients.json"
import CustomersPage from "@/components/customers/CustomerPage";
import { Customer } from "@/types/customer";
import getValue from "@/components/Singleton";

export default async function ManageClientsPage() {
  // Get API
  const apiUrl = getValue("API");

  const data = await fetch(apiUrl + `/customers`);
  const customers: Customer[] = await data.json();

  console.log(customers);

  return <CustomersPage customers={customers} />;
}
