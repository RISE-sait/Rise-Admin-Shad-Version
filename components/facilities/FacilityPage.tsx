"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RightDrawer from "../reusable/RightDrawer"
import CourseTable from "./FacilityTable"
import AddClientForm from "./AddCourseForm"
import { useDrawer } from "../../hooks/drawer"
import { Course } from "@/types/course"
import SearchBar from "../reusable/SearchBar"
import { Facility } from "@/types/facility"
import FacilityTable from "./FacilityTable"

export default function FacilitiesPage({ facilities }: { facilities: Facility[] }) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null)
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer()

  const handleAddFacility = (course: Course) => {
    // Add client to the list (you might want to update the state or make an API call here)
    closeDrawer()
  }

  const handleFacilitySelect = (id: string) => {
    setSelectedFacilityId(id)
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
        <h1 className="text-2xl font-semibold mb-4">Facilities</h1>
        <div className="flex items-center gap-2 mb-4">
          <SearchBar placeholderText="Search Facilities"/>
          <Button variant="outline" onClick={() => openDrawer("add")} className="ml-auto">
            Add Facility
          </Button>
        </div>
        <FacilityTable facilities={facilities} onFacilitySelect={handleFacilitySelect} />
      </div>
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={closeDrawer}
        title={getDrawerTitle()}
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