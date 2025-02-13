// import ClientsPage from "../../../../components/clients/ClientPage"
// import clientsData from "../../../../data/clients.json"
import CustomersPage from "@/components/customers/CustomerPage"
import { Customer } from "@/types/customer"

export default async function ManageClientsPage() {

  const data = await fetch(`http://localhost:8080/api/customers`)
  const customers: Customer[] = await data.json()

  console.log(customers)
  
  return <CustomersPage customers={customers} />
}