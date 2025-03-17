"use client";

import React, { useState } from "react";
import { Membership } from "@/types/membership";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MembershipInfoPanel from "./MembershipInfoPanel";
import AddMembershipForm from "./AddForm";
import { toast } from "sonner";
import RightDrawer from "@/components/reusable/RightDrawer";
import { deleteMembership } from "@/services/membership";
import { useUser } from "@/contexts/UserContext";
import { revalidateMemberships } from "@/app/actions/serverActions";
import MembershipTable from "./table/MembershipTable";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import columns from "./table/columns";
import { VisibilityState } from "@tanstack/react-table";

export default function MembershipsPage({ memberships }: { memberships: Membership[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add">("details");
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useUser();

  // Filter memberships based on search query
  const filteredMemberships = searchQuery
    ? memberships.filter(membership =>
      membership.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (membership.description && membership.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : memberships;

     const handleColumnVisibilityChange = (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
        setColumnVisibility(prev => {
          const newState = typeof updater === "function" ? updater(prev) : updater;
          return { ...prev, ...newState };
        });
      };

  const handleMembershipSelect = (membership: Membership) => {
    setSelectedMembership(membership);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleDeleteMembership = async (membershipId: string) => {
    try {
      await deleteMembership(membershipId, user?.Jwt!);

      await revalidateMemberships();

      toast.success("Membership deleted successfully");
    } catch (error) {
      console.error("Error deleting membership:", error);
      toast.error("Failed to delete membership");
    }
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl font-semibold mb-6 ">Memberships</h1>

      <div className="flex items-center justify-between gap-4 mb-6">

        <Input
          placeholder="Search memberships..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="gap-2"
        >
          Add Membership
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-gray-300 text-sm pl-2">{filteredMemberships.length} memberships found</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Columns
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns
              .filter(column => column.enableHiding !== false)
              .map((column) => {
                const columnId = (column as any).id;
                return (
                  <DropdownMenuCheckboxItem
                    key={columnId}
                    className="capitalize"
                    checked={columnVisibility[columnId] ?? true}
                    onCheckedChange={(value) =>
                      handleColumnVisibilityChange(prev => ({
                        ...prev,
                        [columnId]: value
                      }))
                    }
                  >
                    {columnId}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

      <MembershipTable
        memberships={filteredMemberships}
        onMembershipSelect={handleMembershipSelect}
        onDeleteMembership={handleDeleteMembership}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[65%]" : "w-[35%] max-w-[450px]"}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Membership Details" : "Add New Membership"}
          </h2>
          {drawerContent === "details" && selectedMembership && (
            <MembershipInfoPanel membership={selectedMembership} />
          )}
          {drawerContent === "add" && <AddMembershipForm />}
        </div>
      </RightDrawer>
    </div>
  );
}