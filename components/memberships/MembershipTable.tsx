"use client"
// ...existing code...
// Removed MUI imports (DataGrid, etc.)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/dates"
import { Membership } from "@/types/membership"

export default function MembershipTable({
  memberships,
  onMembershipSelect,
}: {
  memberships: Membership []
  onMembershipSelect: (membership: Membership) => void
}) {
  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((membership) => (
            <TableRow
              key={membership.id}
              onClick={() => onMembershipSelect(membership)}
              className="cursor-pointer"
            >
              <TableCell>{membership.name}</TableCell>
              <TableCell >{membership.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}