"use client";

import { format } from "date-fns";
import { Loader2, FolderSearch } from "lucide-react";
import { StaffActivityLog } from "@/types/staff-activity-log";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditTableProps {
  logs: StaffActivityLog[];
  isLoading?: boolean;
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

function formatTimestamp(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  try {
    return format(date, "PPpp");
  } catch (error) {
    return value;
  }
}

export default function AuditTable({
  logs,
  isLoading = false,
  total,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: AuditTableProps) {
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  const hasPrev = currentPage > 0;
  const hasNext = totalPages ? currentPage < totalPages - 1 : false;
  const start = total > 0 ? currentPage * pageSize + 1 : 0;
  const end = Math.min((currentPage + 1) * pageSize, total);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/100 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Staff Name
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Email
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Activity
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading activity logs…</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length ? (
              logs.map((log) => (
                <TableRow
                  key={`${log.id}-${log.createdAt}`}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50"
                >
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {log.staffName || "Unknown"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {log.staffEmail || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {log.description || "No description"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                    <span>No activity logs found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="bg-muted/30 px-6 py-4 border-t rounded-b-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            {total > 0 ? (
              <>
                Showing <span className="font-semibold">{start}</span>-
                <span className="font-semibold">{end}</span> of{" "}
                <span className="font-semibold">{total}</span> logs
              </>
            ) : (
              <>No logs to display</>
            )}
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            {onPageSizeChange ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border">
                    {pageSizeOptions.map((size) => (
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
            ) : null}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
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
