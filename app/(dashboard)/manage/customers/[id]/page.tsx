"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Customer } from "@/types/customer"
import clientsData from "@/data/clients.json"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClientDetail() {
  const [client, setClient] = useState<Customer | null>(null)
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const clientData = clientsData.find((c) => c.id === id)
    setClient(clientData || null)
  }, [id])

  if (!client) return <div>Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Client Details</h2>
      <p className="text-lg">Name: {client.name}</p>
      <p className="text-lg">Email: {client.email}</p>
      <p className="text-lg">Phone: {client.phone}</p>
      <p className="text-lg">Membership: {client.membership}</p>
      <p className="text-lg">Account Type: {client.accountType}</p>
      <Avatar className="w-16 h-16 rounded-full">
        <AvatarImage src={client.profilePicture} alt={client.name} />
        <AvatarFallback>{client.name?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
    </div>
  )
}