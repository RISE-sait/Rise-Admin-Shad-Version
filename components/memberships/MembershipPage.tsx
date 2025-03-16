"use client";

import React, { useState } from "react";
import MembershipTable from "./MembershipTable";
import { Membership } from "@/types/membership";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import MembershipInfoPanel from "./MembershipInfoPanel";
import AddMembershipForm from "./AddForm";
import { toast } from "sonner";
import getValue from "@/components/Singleton";
import RightDrawer from "@/components/reusable/RightDrawer";

export default function MembershipsPage({ memberships }: { memberships: Membership[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add">("details");
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  
  const apiUrl = getValue("API");

  // Filter memberships based on search query
  const filteredMemberships = searchQuery 
    ? memberships.filter(membership => 
        membership.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (membership.description && membership.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : memberships;

  const handleMembershipSelect = (membership: Membership) => {
    setSelectedMembership(membership);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleDeleteMembership = async (membershipId: string) => {
    try {
      const response = await fetch(`${apiUrl}/memberships/${membershipId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete membership");
      }

      toast.success("Membership deleted successfully");
      // Remove the deleted membership from the list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting membership:", error);
      toast.error("Failed to delete membership");
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Memberships</h2>
          <p className="text-muted-foreground">
            Manage your organization's membership packages
          </p>
        </div>
        <Button 
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Membership
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memberships..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
          <h2 className="text-2xl font-semibold mb-4">
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