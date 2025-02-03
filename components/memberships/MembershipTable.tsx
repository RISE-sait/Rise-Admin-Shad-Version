"use client"
// ...existing code...
// Removed MUI imports (DataGrid, etc.)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Membership } from "@/types/membership"

export default function MembershipTable({
  memberships,
  onMembershipSelect,
}: {
  memberships: Membership []
  onMembershipSelect: (id: string) => void
}) {
  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((membership) => (
            <TableRow
              key={membership.id}
              onClick={() => onMembershipSelect(membership.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>{membership.name}</TableCell>
              <TableCell>{membership.description}</TableCell>
              <TableCell>{membership.start_date}</TableCell>
              <TableCell>{membership.end_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}