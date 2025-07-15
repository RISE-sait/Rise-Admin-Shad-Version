// Import React for JSX support and utilities
import * as React from "react";
// Import type definitions for column configuration
import { ColumnDef } from "@tanstack/react-table";
// Import Court type for defining row data shape
import { Court } from "@/types/court";
// Import Button component for interactive headers and action triggers
import { Button } from "@/components/ui/button";
// Import icons for sorting indicators and menu trigger
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
// Import dropdown menu components for action menus
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the columns configuration for the courts table
const columns: ColumnDef<Court>[] = [
  {
    id: "name", // Unique column identifier
    accessorKey: "name", // Key to read from each Court object
    // Custom header renderer with sorting control
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Court
        <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
      </Button>
    ),
    minSize: 180, // Minimum width for this column
    size: 250, // Default width for this column
  },
  {
    id: "location_name", // Column for the location name
    accessorKey: "location_name", // Key to read from Court object
    // Header renderer with sorting functionality
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Location
        <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
      </Button>
    ),
    // Cell renderer to show location or fallback dash
    cell: ({ row }) => row.getValue("location_name") || "-",
    minSize: 180,
    size: 250,
  },
  {
    id: "actions", // Column for action buttons
    enableHiding: false, // Prevent hiding this column via UI
    header: () => <div className="text-right">Actions</div>, // Header label
    // Cell renderer to show dropdown menu for each row
    cell: ({ row, table }) => {
      const court = row.original; // The original data object for this row
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
                <span className="sr-only">Open menu</span>{" "}
                {/* Accessible label */}
                <MoreHorizontal className="h-4 w-4" /> {/* Menu icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border bg-popover text-popover-foreground"
            >
              <DropdownMenuLabel className="px-3 py-2">
                Court Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  // Retrieve the onCourtSelect callback from table metadata
                  const onSelect = (table.options.meta as any)?.onCourtSelect;
                  onSelect?.(court); // Invoke edit action for this court
                }}
              >
                <span>Edit</span> {/* Menu item label */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    minSize: 80, // Minimum width for actions column
    size: 120, // Default width for actions column
  },
];

// Export the configured columns for use in the table component
export default columns;
