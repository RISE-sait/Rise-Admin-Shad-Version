"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, UserX, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/user";

// Define a type for tracking which columns are visible (true/false per column ID)
type VisibilityState = Record<string, boolean>;

interface StaffTableProps {
  data: User[]; // Array of User objects to display
  loading: boolean; // Indicates whether data is still loading
  onStaffSelect: (staff: User) => void; // Callback when a row is clicked

  columnVisibility: VisibilityState; // Parent‐controlled visibility map
  onColumnVisibilityChange: (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => void; // Setter for visibility map
}

export default function StaffTable({
  data,
  loading,
  onStaffSelect,

  columnVisibility,
  onColumnVisibilityChange,
}: StaffTableProps) {
  // ─── Pagination / Sorting State ─────────────────────────────────────────────
  const [pageSize, setPageSize] = useState(10); // Number of rows per page
  const [page, setPage] = useState(0); // Current page index (0‐based)
  const [sortField, setSortField] = useState<keyof User>("Name"); // Field to sort by
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Sort direction

  // Toggle sorting state: if same field, reverse; otherwise start ascending
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(0); // Reset to first page on sort change
  };

  // ─── Compute sortedData and paginatedData ────────────────────────────────────
  const sortedData = useMemo(() => {
    // Copy array and sort according to sortField & sortDirection
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      // Handle undefined values first
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortDirection === "asc" ? 1 : -1;
      if (bValue === undefined) return sortDirection === "asc" ? -1 : 1;
      // Compare primitive values
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  // Calculate total number of pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Slice the sortedData to just the rows for the current page
  const paginatedData = useMemo(
    () =>
      sortedData.slice(
        page * pageSize,
        Math.min(sortedData.length, (page + 1) * pageSize)
      ),
    [sortedData, page, pageSize]
  );

  // ─── Count how many columns are visible (for “No data” colSpan) ─────────────
  // List all column IDs in the same order they appear in the table header
  const allColumnIds = [
    "Avatar",
    "Name",
    "Role",
    "Email",
    "Phone",
    "Status",
    "Actions",
  ];
  const visibleColumnsCount = useMemo(() => {
    return allColumnIds.reduce((count, id) => {
      // If visibility[id] is explicitly false, skip; otherwise count as visible
      return columnVisibility[id] === false ? count : count + 1;
    }, 0);
  }, [columnVisibility]);

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/100 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b">
              {/** AVATAR COLUMN HEADER */}
              {columnVisibility["Avatar"] !== false && (
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[90px]">
                  Photo
                </TableHead>
              )}

              {/** NAME COLUMN HEADER */}
              {columnVisibility["Name"] !== false && (
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[220px]">
                  {/* Clicking toggles sorting by Name */}
                  <Button variant="ghost" onClick={() => handleSort("Name")}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              {/** ROLE COLUMN HEADER */}
              {columnVisibility["Role"] !== false && (
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[220px]">
                  {/* Role header, no sorting function provided */}
                  <Button variant="ghost">Role</Button>
                </TableHead>
              )}

              {/** EMAIL COLUMN HEADER */}
              {columnVisibility["Email"] !== false && (
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[220px]">
                  {/* Clicking toggles sorting by Email */}
                  <Button variant="ghost" onClick={() => handleSort("Email")}>
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              {/** PHONE COLUMN HEADER */}
              {columnVisibility["Phone"] !== false && (
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[150px]">
                  {/* Clicking toggles sorting by Phone */}
                  <Button variant="ghost" onClick={() => handleSort("Phone")}>
                    Phone <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              {/** STATUS COLUMN HEADER */}
              {columnVisibility["Status"] !== false && (
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[150px]">
                  {/* Status column (Active/Inactive), no sort provided */}
                  <Button variant="ghost">Status</Button>
                </TableHead>
              )}

              {/** ACTIONS COLUMN HEADER */}
              {columnVisibility["Actions"] !== false && (
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b text-right w-[80px]">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              // ─── Render skeleton rows while loading ───────────────────────────
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b">
                  {columnVisibility["Avatar"] !== false && (
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                  )}
                  {columnVisibility["Name"] !== false && (
                    <TableCell className="px-6 py-4">
                      {/* Placeholder skeleton for Name */}
                      <Skeleton className="h-6 w-[180px]" />
                    </TableCell>
                  )}
                  {columnVisibility["Role"] !== false && (
                    <TableCell className="px-6 py-4">
                      {/* Placeholder skeleton for Role */}
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                  )}
                  {columnVisibility["Email"] !== false && (
                    <TableCell className="px-6 py-4">
                      {/* Placeholder skeleton for Email */}
                      <Skeleton className="h-6 w-[180px]" />
                    </TableCell>
                  )}
                  {columnVisibility["Phone"] !== false && (
                    <TableCell className="px-6 py-4">
                      {/* Placeholder skeleton for Phone */}
                      <Skeleton className="h-6 w-[130px]" />
                    </TableCell>
                  )}
                  {columnVisibility["Status"] !== false && (
                    <TableCell className="px-6 py-4">
                      {/* Placeholder skeleton for Status */}
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                  )}
                  {columnVisibility["Actions"] !== false && (
                    <TableCell className="px-6 py-4">
                      {/* Placeholder skeleton for Actions */}
                      <Skeleton className="h-6 w-[60px] ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : sortedData.length === 0 ? (
              // ─── Render “no data” row if sortedData is empty ────────────────
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsCount}
                  className="h-24 text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    {/* Icon and message when no rows exist */}
                    <UserX className="h-8 w-8 text-muted-foreground/70" />
                    <span>No staff members found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // ─── Render actual data rows ────────────────────────────────────
              paginatedData.map((staff) => (
                <TableRow
                  key={staff.ID}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                  onClick={() => onStaffSelect(staff)}
                >
                  {columnVisibility["Avatar"] !== false && (
                    <TableCell className="px-6 py-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={staff.PhotoUrl ?? undefined}
                          alt={staff.Name}
                        />
                        <AvatarFallback className="text-sm font-medium">
                          {getInitials(staff.Name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                  )}
                  {columnVisibility["Name"] !== false && (
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      {staff.Name}
                    </TableCell>
                  )}
                  {columnVisibility["Role"] !== false && (
                    <TableCell className="px-6 py-4 text-sm">
                      {staff.StaffInfo?.Role ?? ""}
                    </TableCell>
                  )}
                  {columnVisibility["Email"] !== false && (
                    <TableCell className="px-6 py-4 text-sm">
                      {staff.Email}
                    </TableCell>
                  )}
                  {columnVisibility["Phone"] !== false && (
                    <TableCell className="px-6 py-4 text-sm">
                      {staff.Phone}
                    </TableCell>
                  )}
                  {columnVisibility["Status"] !== false && (
                    <TableCell className="px-6 py-4 text-sm">
                      <Badge
                        variant={
                          staff.StaffInfo?.IsActive ? "default" : "destructive"
                        }
                        className="font-normal"
                      >
                        {staff.StaffInfo?.IsActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility["Actions"] !== false && (
                    <TableCell className="px-6 py-4 text-sm text-right">
                      {/* Row‐specific “Actions” menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
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
                            Staff Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="px-3 py-2 hover:bg-accent cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStaffSelect(staff);
                            }}
                          >
                            {/* “Edit” option */}
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── Pagination Footer ──────────────────────────────────────────────── */}
      <div className="bg-muted/30 px-6 py-4 border-t rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold">
              {Math.min(paginatedData.length, pageSize)}
            </span>{" "}
            of <span className="font-semibold">{sortedData.length}</span> staff
            members
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              {/* Dropdown to change the number of rows per page */}
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(0);
                }}
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
              {/* Button to go to previous page */}
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              {/* Button to go to next page */}
              <Button
                variant="outline"
                size="sm"
                className="border hover:bg-accent hover:text-accent-foreground"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
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
