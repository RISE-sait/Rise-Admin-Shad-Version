import ClientsPage from "../../../../components/clients/ClientPage"
import clientsData from "../../../../data/clients.json"
import { SearchParams } from "../../../../types/searchParams"

export default async function ManageClientsPage(props: {
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams
  const search = searchParams.name || ""
  const filteredClients = clientsData.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()),
  )
  // return <ClientsPage clients={filteredClients} />
  return <h3>hey</h3>
}