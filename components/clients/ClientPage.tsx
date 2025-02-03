// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import RightDrawer from "../reusable/RightDrawer"
// import ClientTable from "./ClientTable"
// import ClientDetail from "./InfoPanel"
// import AddClientForm from "./AddClientForm"
// import { useDrawer } from "../../hooks/drawer"
// import { Client } from "../../types/clients"
// import SearchBar from "../reusable/SearchBar"

// export default function ClientsPage({ clients }: { clients: Client[] }) {
//   const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
//   const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer()

//   const handleAddClient = (client: Client) => {
//     // Add client to the list (you might want to update the state or make an API call here)
//     closeDrawer()
//   }

//   const handleClientSelect = (id: string) => {
//     setSelectedClientId(id)
//     openDrawer("details")
//   }

//   // Determine the title based on the drawer content
//   const getDrawerTitle = () => {
//     if (drawerContent === "add") return "Add Client"
//     if (drawerContent === "details") return "Client Details"
//     return "Sheet"
//   }
  
//   return (
//     <div className="p-6 flex">
//       <div className="flex-1 overflow-y-auto">
//         <h1 className="text-2xl font-semibold mb-4">Clients</h1>
//         <div className="flex items-center gap-2 mb-4">
//           <SearchBar placeholderText="Search Clients
//           "/>
//           <Button variant="outline" onClick={() => openDrawer("add")} className="ml-auto">
//             Add Client
//           </Button>
//         </div>
//         <ClientTable clients={clients} onClientSelect={handleClientSelect} />
//       </div>
//       <RightDrawer
//         drawerOpen={drawerOpen}
//         handleDrawerClose={closeDrawer}
//       >
//         {drawerContent === "details" && selectedClientId && (
//           <ClientDetail clientId={selectedClientId} onBack={closeDrawer} />
//         )}
//         {drawerContent === "add" && (
//           <AddClientForm onAddClient={handleAddClient} />
//         )}
//       </RightDrawer>
//     </div>
//   )
// }