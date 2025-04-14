"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderSearch } from "lucide-react";
import { Program } from "@/types/program";

import columns from './columns'

interface DataTableProps {
  program: Program[];
  onProgramSelect: (program: Program) => void;
  onDeleteProgram?: (programId: string) => Promise<void> | void;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
}

export default function ProgramTable({
  program,
  onProgramSelect,
  onDeleteProgram,
  columnVisibility,
  onColumnVisibilityChange,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: program,
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
    getSortedRowModel: getSortedRowModel(),
    meta: { onProgramSelect, onDeleteProgram },
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
                  onClick={() => onProgramSelect(row.original)}
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
                    <span>No programs found</span>
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