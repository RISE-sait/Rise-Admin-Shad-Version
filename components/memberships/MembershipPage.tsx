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
import { revalidateMemberships } from "@/actions/serverActions";
import MembershipTable from "./table/MembershipTable";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusIcon, Search } from "lucide-react";
import columns from "./table/columns";
import { VisibilityState } from "@tanstack/react-table";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/ui/AlertModal";

export default function MembershipsPage({ memberships }: { memberships: Membership[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const { user } = useUser();

  // Filter memberships based on search query
  const filteredMemberships = searchQuery
    ? memberships.filter(
        (membership) =>
          membership.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (membership.description &&
            membership.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : memberships;

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

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteMembership(id, user?.Jwt!)));
      await revalidateMemberships();
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      toast.success("Selected memberships deleted successfully");
    } catch (error) {
      console.error("Error deleting memberships:", error);
      toast.error("Failed to delete memberships");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Memberships" description="Manage your memberships and their details" />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Membership
        </Button>
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memberships..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Columns
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((column) => column.enableHiding !== false)
                .map((column) => {
                  const columnId = (column as any).id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className="capitalize"
                      checked={columnVisibility[columnId] ?? true}
                      onCheckedChange={(value) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [columnId]: value,
                        }))
                      }
                    >
                      {columnId}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setBulkDeleteOpen(true)}
              className="ml-4"
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <MembershipTable
        memberships={filteredMemberships}
        onMembershipSelect={handleMembershipSelect}
        onDeleteMembership={handleDeleteMembership}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <AlertModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={false} // Update with actual loading state if needed
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[25%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Membership Details" : "Add Membership"}
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