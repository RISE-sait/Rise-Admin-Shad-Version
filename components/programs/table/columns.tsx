import { Program } from "@/types/program";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getProgramTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'practice': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'course': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'game': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  }
};

const columns: ColumnDef<Program>[] = [
  {
    id: "name",
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
    minSize: 180,
    size: 250,
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string || "other";
      return (
        <Badge variant="outline" className={`${getProgramTypeColor(type)}`}>
          {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
        </Badge>
      );
    },
    minSize: 100,
    size: 120,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      return desc?.length > 60 ? desc.slice(0, 60) + "..." : desc || "";
    },
    minSize: 250,
    size: 400,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const program = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="border bg-popover text-popover-foreground"
            >
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  const onSelect = (table.options.meta as any)?.onPracticeSelect;
                  onSelect?.(program);
                }}
              >
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-destructive/10 cursor-pointer text-destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this program?")) {
                    const onDelete = (table.options.meta as any)?.onDeletePractice;
                    onDelete?.(program.id);
                  }
                }}
              >
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    minSize: 80,
    size: 120,
  },
];

export default columns;