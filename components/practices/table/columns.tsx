import { ColumnDef } from "@tanstack/react-table";
import { Practice } from "@/types/practice";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { fromZonedISOString } from "@/lib/utils";

// Column definitions for the PracticeTable component

const columns: ColumnDef<Practice>[] = [
  {
    id: "team_name",
    accessorKey: "team_name",
    header: "Team",
    cell: ({ row }) => row.getValue("team_name") || "-",
    minSize: 120,
    size: 180,
  },
  {
    id: "location_name",
    accessorKey: "location_name",
    header: "Location",
    minSize: 120,
    size: 180,
  },
  {
    id: "court_name",
    accessorKey: "court_name",
    header: "Court",
    minSize: 120,
    size: 180,
  },
  {
    id: "start_at",
    accessorKey: "start_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Start Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      fromZonedISOString(row.getValue("start_at")).toLocaleString(),
    minSize: 180,
    size: 220,
  },
  {
    id: "booked_by",
    accessorKey: "booked_by",
    header: "Booked By",
    cell: ({ row }) => row.getValue("booked_by") || "-",
    minSize: 150,
    size: 200,
  },
];

export default columns;
