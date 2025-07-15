// Mark this file as a client-side component in Next.js
"use client";

import * as React from "react"; // React core import
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"; // Import table utilities and types from TanStack Table
import { Court } from "@/types/court"; // Type definition for court data
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // UI table components
import { Button } from "@/components/ui/button"; // Button component for pagination controls
import { FolderSearch } from "lucide-react"; // Icon for empty state
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // UI select components for page size selector
import columns from "./columns"; // Column definitions for the table

// Define props for the CourtTable component
interface DataTableProps {
  courts: Court[]; // Array of courts to display
  onCourtSelect: (court: Court) => void; // Callback when a row is clicked
  columnVisibility: VisibilityState; // Visibility state for each column
  onColumnVisibilityChange: (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => void; // Handler to change column visibility
}

// Component to render a table of courts with sorting, filtering, pagination
export default function CourtTable({
  courts,
  onCourtSelect,
  columnVisibility,
  onColumnVisibilityChange,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]); // State for sort order
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  ); // State for column filters

  // Initialize the table instance with data, state, and models
  const table = useReactTable({
    data: courts, // Row data
    columns, // Column definitions
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting, // Update sorting state
    onColumnFiltersChange: setColumnFilters, // Update filter state
    onColumnVisibilityChange: (newVisibility) => {
      // Handle column visibility updates
      if (typeof newVisibility === "function") {
        // If function updater, apply to current state
        onColumnVisibilityChange(newVisibility(columnVisibility));
      } else {
        // Otherwise, set directly
        onColumnVisibilityChange(newVisibility);
      }
    },
    getCoreRowModel: getCoreRowModel(), // Basic row model
    getFilteredRowModel: getFilteredRowModel(), // Apply filters
    getPaginationRowModel: getPaginationRowModel(), // Apply pagination
    getSortedRowModel: getSortedRowModel(), // Apply sorting
    meta: { onCourtSelect }, // Pass through row click handler via meta
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Table container with border and rounded corners */}
      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
          {/* Table header with sticky positioning */}
          <TableHeader className="bg-muted/100 sticky top-0 z-10">
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
                      minWidth: header.column.columnDef.minSize, // Min width from column def
                      width: header.column.getSize(), // Current width
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {flexRender(
                        header.column.columnDef.header, // Render header content
                        header.getContext() // Provide context for header
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {/* Table body */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onCourtSelect(row.original)} // Row click handler
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 text-sm font-medium"
                      style={{
                        minWidth: cell.column.columnDef.minSize, // Min width
                        width: cell.column.getSize(), // Cell width
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell, // Render cell content
                        cell.getContext() // Provide context for cell
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state when no rows are present
              <TableRow>
                <TableCell
                  colSpan={columns.length} // Span all columns
                  className="h-24 text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                    <span>No courts found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination and page size controls */}
      <div className="bg-muted/30 px-6 py-4 border-t rounded-b-xl">
        <div className="flex items-center justify-between">
          {/* Display row count summary */}
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold">
              {table.getRowModel().rows.length} {/* Visible rows */}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {table.getFilteredRowModel().rows.length}{" "}
              {/* Total filtered rows */}
            </span>{" "}
            courts
          </div>
          <div className="flex items-center space-x-6">
            {/* Rows per page selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <Select
                value={String(table.getState().pagination.pageSize)} // Current page size
                onValueChange={(value) => table.setPageSize(Number(value))} // Update page size
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border">
                  {[5, 10, 20, 50, 100].map((size) => (
                    <SelectItem
                      key={size}
                      value={String(size)}
                      className="text-sm"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Pagination buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => table.previousPage()} // Go to previous page
                disabled={!table.getCanPreviousPage()} // Disable if none
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => table.nextPage()} // Go to next page
                disabled={!table.getCanNextPage()} // Disable if none
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
