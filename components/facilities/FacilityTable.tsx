"use client"
// ...existing code...
// Removed MUI imports (DataGrid, etc.)
import { Facility } from "../../types/facility"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function FacilityTable({
  facilities,
  onFacilitySelect,
}: {
  facilities: Facility []
  onFacilitySelect: (id: string) => void
}) {
  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow
              key={facility.id}
              onClick={() => onFacilitySelect(facility.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>{facility.name}</TableCell>
              <TableCell>{facility.location}</TableCell>
              <TableCell>{facility.facility_type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}