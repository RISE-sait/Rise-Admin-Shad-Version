"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RightDrawer from "../reusable/RightDrawer"
import CourseTable from "./MembershipTable"
import AddClientForm from "./AddCourseForm"
import { useDrawer } from "../../hooks/drawer"
import { Course } from "@/types/course"
import SearchBar from "../reusable/SearchBar"
import { Facility } from "@/types/facility"
import FacilityTable from "./MembershipTable"
import { Membership } from "@/types/membership"
import MembershipTable from "./MembershipTable"

export default function MembershipsPage({ memberships }: { memberships: Membership[] }) {
  const [selectedMembershipId, setSelectedMembershipId] = useState<string | null>(null)
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer()

  const handleAddFacility = (course: Course) => {
    // Add client to the list (you might want to update the state or make an API call here)
    closeDrawer()
  }

  const handleMembershipSelect = (id: string) => {
    setSelectedMembershipId(id)
    openDrawer("details")
  }

  // Determine the title based on the drawer content
  const getDrawerTitle = () => {
    if (drawerContent === "add") return "Add Facility"
    if (drawerContent === "details") return "Facility Details"
    return "Sheet"
  }
  
  return (
    <div className="p-6 flex">
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Memberships</h1>
        <div className="flex items-center gap-2 mb-4">
          <SearchBar placeholderText="Search Memberships"/>
          <Button variant="outline" onClick={() => openDrawer("add")} className="ml-auto">
            Add Membership
          </Button>
        </div>
        <MembershipTable memberships={memberships} onMembershipSelect={handleMembershipSelect} />
      </div>
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={closeDrawer}
      >
        <h3>he</h3>
        {/* {drawerContent === "details" && selectedCourseId && (
          <ClientDetail clientId={selectedCourseId} onBack={closeDrawer} />
        )} */}
        {/* {drawerContent === "add" && (
          <AddClientForm onAddClient={handleAddCourse} />
        )} */}
      </RightDrawer>
    </div>
  )
}