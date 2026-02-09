"use client";

import { User, StaffRoleEnum } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface StaffTableProps {
  staffList: User[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalStaff: number;
  itemsPerPage: number;
  roleFilter: string;
  onPageChange: (page: number) => void;
  onStaffClick: (staff: User) => void;
}

export function StaffTable({
  staffList,
  loading,
  currentPage,
  totalPages,
  totalStaff,
  itemsPerPage,
  roleFilter,
  onPageChange,
  onStaffClick,
}: StaffTableProps) {
  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case StaffRoleEnum.SUPERADMIN:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case StaffRoleEnum.IT:
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case StaffRoleEnum.ADMIN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case StaffRoleEnum.COACH:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case StaffRoleEnum.BARBER:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case StaffRoleEnum.RECEPTIONIST:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatRoleName = (role?: string) => {
    if (!role) return "Unknown";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (staffList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {roleFilter && roleFilter !== "all"
            ? `No ${roleFilter} staff members found`
            : "No staff members found"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow
                key={staff.ID}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onStaffClick(staff)}
              >
                <TableCell className="font-medium">{staff.Name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {staff.Email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {staff.Phone || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getRoleBadgeColor(staff.StaffInfo?.Role)}
                  >
                    {formatRoleName(staff.StaffInfo?.Role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {staff.StaffInfo?.IsActive ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Inactive</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalStaff)} of{" "}
            {totalStaff} staff
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
