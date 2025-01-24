"use client"
// ...existing code...
// Removed MUI imports (DataGrid, etc.)
import { Client } from "../../types/clients"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ClientTable({
  clients,
  onClientSelect,
}: {
  clients: Client[]
  onClientSelect: (id: string) => void
}) {
  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Account Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              onClick={() => onClientSelect(client.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>
                <Avatar>
                <AvatarImage src={client.profilePicture} alt={client.name} />
                {/* Optional fallback */}
                <AvatarFallback>{client.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.membership}</TableCell>
              <TableCell>{client.accountType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}