"use client";
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
import { Location } from "@/types/location";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, FolderSearch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps {
  facilities: Location[];
  onFacilitySelect: (facility: Location) => void;
  onDeleteFacility?: (facilityId: string) => Promise<void> | void;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
}

export const columns: ColumnDef<Location>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Location
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 180,
    size: 250,
  },
  {
    id: "address",
    accessorKey: "Address", // Changed to lowercase to match API
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Address
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 200,
    size: 300,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const facility = row.original;
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
              <DropdownMenuLabel className="px-3 py-2">
                Facility Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  const onSelect = (table.options.meta as any)?.onFacilitySelect;
                  onSelect?.(facility);
                }}
              >
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-destructive/10 cursor-pointer text-destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this facility?")) {
                    const onDelete = (table.options.meta as any)?.onDeleteFacility;
                    onDelete?.(facility.id);
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

export default function FacilityTable({
  facilities,
  onFacilitySelect,
  onDeleteFacility,
  columnVisibility,
  onColumnVisibilityChange,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: facilities,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (newVisibility) => {
      if (typeof newVisibility === "function") {
        onColumnVisibilityChange(newVisibility(columnVisibility));
      } else {
        onColumnVisibilityChange(newVisibility);
      }
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { onFacilitySelect, onDeleteFacility },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
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
                      minWidth: header.column.columnDef.minSize,
                      width: header.column.getSize(),
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onFacilitySelect(row.original)}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50"
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                    <span>No locations found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/30 px-6 py-4 border-t rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold">{table.getRowModel().rows.length}</span>{' '}
            of{' '}
            <span className="font-semibold">
              {table.getFilteredRowModel().rows.length}
            </span>{' '}
            locations
          </div>
          
          {/* <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
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

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}