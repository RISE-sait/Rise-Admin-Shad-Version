"use client";

import React, { useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import PendingStaffTable from "./PendingStaffTable";
import PendingStaffInfo from "@/components/pending-staff/PendingStaffInfo";
import { User } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import columnsPendingStaff from "./columnsPendingStaff";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VisibilityState } from "@tanstack/react-table";

// Props for paginated staff page
interface PendingPageProps {
  staffs: User[]; // List of pending staff
  onApproved?: () => void; // Callback after any approval
}

export default function PendingStaffPage({
  staffs,
  onApproved,
}: PendingPageProps) {
  // Selected staff for the side drawer
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  // Control drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Search query text state
  const [searchQuery, setSearchQuery] = useState("");
  // Column visibility map
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Open drawer with selected staff item
  const handleStaffSelect = (staffMember: User) => {
    setSelectedStaff(staffMember);
    setDrawerOpen(true);
  };

  // Close drawer and reset selection after animation
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedStaff(null);
    }, 300);
  };

  // Filter logic for search across multiple fields
  const filteredStaff = staffs.filter(
    (member) =>
      member.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member
        .StaffInfo!.Role.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      member.Phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Pending Staff" description="Staff awaiting approval" />
      </div>

      <Separator />

      {/* Search input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pending staff"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update query
        />
      </div>

      {/* Column visibility filters */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1 hover:bg-gray-100">
              Filters
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columnsPendingStaff
              .filter((col) => col.enableHiding !== false) // Only hideable cols
              .map((col) => {
                const colId = col.id as string;
                const isChecked = columnVisibility[colId] !== false;
                return (
                  <DropdownMenuCheckboxItem
                    key={colId}
                    className="capitalize"
                    checked={isChecked}
                    onCheckedChange={(visible) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [colId]: visible,
                      }))
                    }
                  >
                    {colId}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table component */}
      <PendingStaffTable
        data={filteredStaff}
        loading={false}
        onStaffSelect={handleStaffSelect}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      {/* Side drawer for info/approval */}
      <Sheet
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) handleDrawerClose();
        }}
      >
        <SheetContent className="w-full sm:max-w-md md:max-w-xl overflow-y-auto pb-0">
          {selectedStaff && (
            <PendingStaffInfo
              staff={selectedStaff}
              onApproved={() => {
                handleDrawerClose();
                onApproved?.();
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
