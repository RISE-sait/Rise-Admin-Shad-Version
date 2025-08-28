import { ColumnDef } from "@tanstack/react-table";
import { LoginLog } from "@/types/login-logs";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<LoginLog>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 150,
    size: 200,
  },
  {
    accessorKey: "email",
    header: "Email",
    minSize: 200,
    size: 250,
  },
  {
    accessorKey: "loginTime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Login Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.getValue("loginTime")).toLocaleString(),
    minSize: 180,
    size: 220,
  },
];

export default columns;
