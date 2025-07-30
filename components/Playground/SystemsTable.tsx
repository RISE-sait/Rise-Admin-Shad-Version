"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, FolderSearch } from "lucide-react";
import { PlaygroundSystem } from "@/types/playground";

interface SystemsTableProps {
  systems: PlaygroundSystem[];
  onSystemSelect: (system: PlaygroundSystem) => void;
}

export default function SystemsTable({
  systems,
  onSystemSelect,
}: SystemsTableProps) {
  const [ascending, setAscending] = React.useState(true);

  const sortedSystems = React.useMemo(() => {
    const sorted = [...systems].sort((a, b) => a.name.localeCompare(b.name));
    return ascending ? sorted : sorted.reverse();
  }, [systems, ascending]);

  return (
    <div className="rounded-xl overflow-hidden border">
      <Table className="border-collapse">
        <TableHeader className="bg-muted/100 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead
              className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b cursor-pointer"
              onClick={() => setAscending(!ascending)}
            >
              <div className="flex items-center space-x-2">
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSystems.length ? (
            sortedSystems.map((system) => (
              <TableRow
                key={system.id}
                className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                onClick={() => onSystemSelect(system)}
              >
                <TableCell className="px-6 py-4 text-sm font-medium">
                  {system.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-right">
                  <div
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                          System Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          className="px-3 py-2 hover:bg-accent cursor-pointer"
                          onClick={() => onSystemSelect(system)}
                        >
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={2}
                className="h-24 text-center py-8 text-muted-foreground"
              >
                <div className="flex flex-col items-center space-y-2">
                  <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                  <span>No systems found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
