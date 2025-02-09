"use Customer"
// ...existing code...
// Removed MUI imports (DataGrid, etc.)
import { Customer } from "../../types/customer"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function CustomerTable({
  customers,
  onCustomerSelect,
}: {
  customers: Customer[]
  onCustomerSelect: (id: string) => void
}) {
  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Attendace</TableHead>
            <TableHead>Expiration Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.customer_id}
              onClick={() => onCustomerSelect(customer.customer_id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>
                <Avatar>
                  {/* <AvatarImage src={customer.profilePicture} alt={customer.name} /> */}
                  {/* Optional fallback */}
                  <AvatarFallback>{customer.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.membership}</TableCell>
              <TableCell>{customer.attendance}</TableCell>
              <TableCell>{new Date(customer.membership_renewal_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}