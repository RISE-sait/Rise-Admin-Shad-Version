"use client";

// React and table utilities
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Customer type definition
import { Customer } from "@/types/customer";

// UI components for table layout
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal, FolderSearch } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Select components for pagination or filters
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Avatar component for user images
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Props for the CustomerTable component
interface DataTableProps {
  customers: Customer[]; // list of customers to display
  onCustomerSelect: (customer: Customer) => void; // callback when a row is clicked
  onArchiveCustomer?: (customerId: string) => Promise<void> | void; // optional archive/unarchive handler
  isArchivedList?: boolean; // whether this table shows archived customers
  columnVisibility: VisibilityState; // visibility state for each column
  onColumnVisibilityChange: (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => void; // callback to toggle column visibility
  selectedIds: string[]; // currently selected row IDs
  onSelectionChange: (selectedIds: string[]) => void; // callback when row selection changes
}

// Column definitions for the table
export const columns: ColumnDef<Customer>[] = [
  {
    id: "avatar",
    accessorKey: "name",
    header: "Avatar", // column header label
    cell: ({ row }) => (
      // render avatar or fallback initial
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={row.original.profilePicture || ""}
          alt={`${row.original.first_name} ${row.original.last_name}`}
        />
        <AvatarFallback>
          {row.original.first_name?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
    ),
    size: 40, // fixed width for avatar column
  },
  {
    id: "name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`, // compute full name
    header: ({ column }) => (
      // clickable header to sort by name
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
    size: 200,
  },
  {
    id: "email",
    accessorKey: "email", // direct accessor for email
    header: "Email",
    minSize: 200,
    size: 250,
  },
  {
    id: "membership",
    accessorKey: "membership", // key for membership status
    header: "Membership",
    cell: ({ row }) => row.original.membership_name || "None", // display membership name
    minSize: 120,
    size: 150,
  },
  {
    id: "start_date",
    accessorKey: "membership_start_date", // key for membership start date
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.original.membership_start_date;
      return date ? new Date(date).toLocaleDateString() : "N/A";
    },
    minSize: 120,
    size: 150,
  },
  {
    id: "actions",
    enableHiding: false, // always show actions column
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const customer = row.original;
      return (
        // actions dropdown (Edit / Archive)
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border bg-popover text-popover-foreground"
            >
              <DropdownMenuLabel className="px-3 py-2">
                Customer Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  const onSelect = (table.options.meta as any)
                    ?.onCustomerSelect;
                  onSelect?.(customer);
                }}
              >
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="px-3 py-2 hover:bg-destructive/10 cursor-pointer text-destructive">
                    <span>
                      {(table.options.meta as any)?.isArchivedList
                        ? "Unarchive"
                        : "Archive"}
                    </span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {(table.options.meta as any)?.isArchivedList
                        ? "Confirm Unarchive"
                        : "Confirm Archive"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {(table.options.meta as any)?.isArchivedList
                        ? "Are you sure you want to unarchive this customer?"
                        : "Are you sure you want to archive this customer?"}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        const handler = (table.options.meta as any)
                          ?.onArchiveCustomer;
                        handler?.(customer.id);
                      }}
                    >
                      {(table.options.meta as any)?.isArchivedList
                        ? "Confirm Unarchive"
                        : "Confirm Archive"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    minSize: 80,
    size: 120,
  },
];

// Main CustomerTable component
export default function CustomerTable({
  customers,
  onCustomerSelect,
  onArchiveCustomer,
  isArchivedList,
  columnVisibility,
  onColumnVisibilityChange,
  selectedIds,
  onSelectionChange,
}: DataTableProps) {
  // state for table sorting
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // state for column filters
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  // state for row selection checkboxes
  const [rowSelection, setRowSelection] = React.useState({});

  // initialize react-table instance
  const table = useReactTable({
    data: customers,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting, // update sorting state
    onColumnFiltersChange: setColumnFilters, // update filters
    onColumnVisibilityChange: (newVisibility) => {
      // propagate visibility change up
      if (typeof newVisibility === "function") {
        onColumnVisibilityChange(newVisibility(columnVisibility));
      } else {
        onColumnVisibilityChange(newVisibility);
      }
    },
    onRowSelectionChange: setRowSelection, // update selected rows
    getCoreRowModel: getCoreRowModel(), // basic row model
    getFilteredRowModel: getFilteredRowModel(), // filtered rows
    getPaginationRowModel: getPaginationRowModel(), // pagination
    getSortedRowModel: getSortedRowModel(), // sorted rows
    meta: { onCustomerSelect, onArchiveCustomer, isArchivedList }, // pass handlers via meta
  });

  // effect to sync selected row IDs with parent component
  React.useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const newSelectedIds = selectedRows.map((row) => row.original.id);
    onSelectionChange(newSelectedIds);
  }, [rowSelection, table, onSelectionChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/100 sticky top-0 z-10">
            {/* Render table headers */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b"
                    style={{
                      minWidth: header.column.columnDef.minSize,
                      width: header.column.getSize(),
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              // Render each data row
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onCustomerSelect(row.original)}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 text-sm font-medium"
                      style={{
                        minWidth: cell.column.columnDef.minSize,
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // No data fallback
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                    <span>No customers found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
