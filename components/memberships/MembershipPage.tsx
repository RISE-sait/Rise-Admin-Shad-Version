"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useDrawer } from "../../hooks/drawer"
import { Course } from "@/types/course"
import SearchBar from "../reusable/SearchBar"
import { Facility } from "@/types/facility"
import FacilityTable from "./MembershipTable"
import { Membership } from "@/types/membership"
import MembershipTable from "./MembershipTable"
// import MembershipDetail from "./MembershipDetail"
import DetailsTab from "./infoTabs/Details"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import MembershipInfoPanel from "./MembershipInfoPanel"
import { Input } from "@/components/ui/input";

export default function MembershipsPage({ memberships }: { memberships: Membership[] }) {
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<"details" | "add" | null>(
    null,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const handleAddFacility = (course: Course) => {
    // Add client to the list (you might want to update the state or make an API call here)
  }

  const handleMembershipSelect = (membership: Membership) => {
    setSelectedMembership(membership)
    setDialogOpen(true)
    setDialogContent("details");
  }

  return (
    <div>
      <div>

        <h1 className="text-xl mb-4">Memberships</h1>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Input
            type="search"
            id="coursesearch"
            placeholder="Search memberships"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setDialogContent("add");
              setDialogOpen(true);
            }}
          >
            Add Membership
          </Button>
        </div>
        <MembershipTable memberships={memberships} onMembershipSelect={handleMembershipSelect} />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogContent === "details" ? "Membership Details" : "Add Membership"}
            </DialogTitle>
            <DialogDescription>
              {dialogContent === "details"
                ? "Manage & Update Membership Information"
                : "Create a Brand New Membership"}
            </DialogDescription>
          </DialogHeader>
          {dialogContent === "details" && selectedMembership && (
            <MembershipInfoPanel membership={selectedMembership} />
          )}
          {/* {dialogContent === "add" && <AddCourseForm />} */}
        </DialogContent>
      </Dialog>
    </div>
  )
}