import { ColumnDef } from "@tanstack/react-table";
import { Game } from "@/types/games";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<Game>[] = [
  {
    id: "match",
    accessorFn: (row) => `${row.home_team_name} vs ${row.away_team_name}`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Match
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 200,
    size: 250,
  },
  {
    id: "location_name",
    accessorKey: "location_name",
    header: "Location",
    minSize: 120,
    size: 180,
  },
  {
    id: "start_time",
    accessorKey: "start_time",
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
    cell: ({ row }) => new Date(row.getValue("start_time")).toLocaleString(),
    minSize: 180,
    size: 220,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    minSize: 80,
    size: 120,
  },
];

export default columns;
