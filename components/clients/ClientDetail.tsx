"use client"
// ...existing code...
// Removed MUI imports (Box, Typography, Tabs, etc.)
import React, { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MembershipTab from "./details/Membership"
import DetailsTab from "./details/Details"
import ClassesTab from "./details/Classes"
import TransactionsTab from "./details/Transactions"
import Notes from "./details/Notes"
import clientsData from "../../data/clients.json"
import { Client } from "../../types/clients"


export default function ClientDetail({
  clientId,
  onBack,
}: {
  clientId: string
  onBack: () => void
}) {
  const [client, setClient] = useState<Client | null>(null)
  const [tabValue, setTabValue] = useState("membership")

  useEffect(() => {
    const c = clientsData.find((item) => item.id === clientId)
    setClient(c || null)
  }, [clientId])

  if (!client) return <div>Loading...</div>

  return (
    <div className="p-4 space-y-4">
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">Client Details</h2>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 rounded-full">
          <AvatarImage src={client.profilePicture} alt={client.name} />
          <AvatarFallback>{client.name?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">{client.name}</p>
          <p className="text-sm text-gray-500">{client.email}</p>
        </div>
      </div>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="flex space-x-1">
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="membership">
          {client.membershipTab && <MembershipTab membershipTab={client.membershipTab} />}
        </TabsContent>

        <TabsContent value="details">
          {client.detailsTab && <DetailsTab detailsTab={client.detailsTab} />}
        </TabsContent>

        <TabsContent value="classes">
          {client.classes && <ClassesTab classes={client.classes} />}
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>

        <TabsContent value="notes">
          <Notes />
        </TabsContent>
      </Tabs>
    </div>
  )
}