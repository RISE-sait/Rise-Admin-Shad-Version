import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

// Define the columns for the staff table. Each ColumnDef<User> represents
// one column: its id, how to render header and cell, and optional settings.
export const columnsPendingStaff: ColumnDef<User>[] = [
  {
    // "Name" column shows the staff member's name.
    id: "Name",
    // Automatically pull the "Name" property from each User object.
    accessorKey: "Name",
    // Header is a ghost-style button that toggles sorting (asc/desc) by name.
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
    // Minimum and default width for this column.
    minSize: 180,
    size: 200,
  },
  {
    // "Email" column shows the staff email address.
    id: "Email",
    // Automatically pull the "Email" property from each User object.
    accessorKey: "Email",
    // Header button toggles sorting by email.
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 200,
    size: 250,
  },
  {
    // "Phone" column shows the staff phone number.
    id: "Phone",
    // Automatically pull the "Phone" property from each User object.
    accessorKey: "Phone",
    // Header button toggles sorting by phone.
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Phone
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 120,
    size: 150,
  },
  {
    // "Status" column shows whether staff is active (Active/Inactive).
    id: "Status",
    // Compute text based on StaffInfo.IsActive boolean.
    accessorFn: () => "Pending",
    // Header renders a button (no sorting logic attached by default).
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => {}}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Status
      </Button>
    ),
    minSize: 100,
    size: 120,
  },
  {
    // "actions" column shows a menu button for editing/deleting each row.
    id: "actions",
    // Do not allow hiding the actions column.
    enableHiding: false,
    // Header simply shows "Actions" aligned right.
    header: () => <div className="text-right">Actions</div>,
    // Cell renderer shows a ghost button with a menu icon.
    cell: ({ row, table }) => {
      const staff = row.original; // The User object for this row
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click
              // Invoke onStaffSelect callback from table meta, passing this staff
              (table.options.meta as any)?.onStaffSelect?.(staff);
            }}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    minSize: 80,
    size: 100,
  },
];

export default columnsPendingStaff;
