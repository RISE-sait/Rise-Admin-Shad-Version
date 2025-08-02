"use client";

import React, { useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import StaffTable from "@/components/staff/StaffTable";
import StaffForm from "@/components/staff/StaffForm";
import { User } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import columnsStaff from "@/components/staff/columnsStaff";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import RightDrawer from "../reusable/RightDrawer";
import { VisibilityState } from "@tanstack/react-table";

export default function StaffPage({ staffs }: { staffs: User[] }) {
  // Holds the staff member currently selected for editing
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  // Controls whether the drawer (right‐side sheet) is open
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Indicates whether the drawer is used for adding a new staff member
  const [isNewStaff, setIsNewStaff] = useState(false);
  // Tracks the text in the search input
  const [searchQuery, setSearchQuery] = useState("");

  // Map of column ID → boolean indicating if that column is visible
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Called when a row is clicked: opens the drawer for editing
  const handleStaffSelect = (staffMember: User) => {
    setSelectedStaff(staffMember);
    setIsNewStaff(false);
    setDrawerOpen(true);
  };

  // Called when the drawer is closed: resets selection and “new” flag after delay
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedStaff(null);
      setIsNewStaff(false);
    }, 300);
  };

  // Filter the staff list based on searchQuery matching Name, Email, Role, or Phone
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
        {/* Heading for the page */}
        <Heading
          title="Staff"
          description="Manage your staff members and their roles"
        />
        {/* Add Staff button was removed per request */}
      </div>

      {/* Horizontal separator */}
      <Separator />

      {/* Search input with an icon */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters dropdown to toggle column visibility */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1 hover:bg-gray-100">
              Filters
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columnsStaff
              // Only include columns where enableHiding is not explicitly false
              .filter((col) => col.enableHiding !== false)
              .map((col) => {
                const colId = col.id as string;
                // If columnVisibility[colId] is false, hide; otherwise show
                const isChecked = columnVisibility[colId] !== false;
                return (
                  <DropdownMenuCheckboxItem
                    key={colId}
                    className="capitalize"
                    checked={isChecked}
                    // Toggling a column sets its visibility flag in state
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

      {/* The table component receives filteredStaff and visibility controls */}
      <StaffTable
        data={filteredStaff}
        loading={false}
        onStaffSelect={handleStaffSelect}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      {/* Drawer for editing or adding staff */}
      {drawerOpen && (
        <RightDrawer
          drawerOpen={drawerOpen}
          handleDrawerClose={handleDrawerClose}
          drawerWidth="w-[700px]"
        >
          <div className="p-4">
            {isNewStaff ? (
              <StaffForm onClose={handleDrawerClose} />
            ) : selectedStaff ? (
              <StaffForm
                StaffData={selectedStaff}
                onClose={handleDrawerClose}
              />
            ) : null}
          </div>
        </RightDrawer>
      )}
    </div>
  );
}
