import { Team } from "@/types/team";

// Column definitions used by the teams data table
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<Team>[] = [
  {
    id: "logo_url",
    accessorKey: "logo_url",
    header: "Logo",
    cell: ({ row }) => {
      const url = row.getValue("logo_url") as string | undefined;
      return url ? (
        <img
          src={url}
          alt="Team Logo"
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : null;
    },
    enableSorting: false,
    enableHiding: false,
    minSize: 50,
    size: 60,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Team
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 180,
    size: 250,
  },
  {
    id: "capacity",
    accessorKey: "capacity",
    header: "Capacity",
    minSize: 80,
    size: 100,
  },
  {
    id: "coach_name",
    accessorKey: "coach_name",
    header: "Coach",
    cell: ({ row }) => row.getValue("coach_name") || "-",
    minSize: 180,
    size: 200,
  },
  {
    id: "is_external",
    accessorKey: "is_external",
    header: "External",
    cell: ({ row }) => {
      const isExternal = row.getValue("is_external") as boolean | undefined;
      return isExternal ? (
        <Badge variant="outline" className="rounded-full">
          External
        </Badge>
      ) : (
        <Badge variant="secondary" className="rounded-full">
          Internal
        </Badge>
      );
    },
    minSize: 100,
    size: 120,
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Updated At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    // Format the date value for display in the table
    cell: ({ row }) => {
      const updatedAt = row.getValue("updated_at") as Date;
      return updatedAt.toLocaleDateString();
    },
    minSize: 120,
    size: 150,
  },
];

export default columns;
