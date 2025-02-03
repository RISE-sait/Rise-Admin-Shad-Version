"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RightDrawer from "../reusable/RightDrawer"
import { useDrawer } from "../../hooks/drawer"
import SearchBar from "../reusable/SearchBar"
import { Facility } from "@/types/facility"
import FacilityTable from "./FacilityTable"
import FacilityInfoPanel from "./FacilityInfoPanel"
import AddFacilityForm from "./AddFacilityForm"

export default function FacilitiesPage({ facilities }: { facilities: Facility[] }) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null)
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer()

  const handleFacilitySelect = (id: string) => {
    setSelectedFacilityId(id)
    openDrawer("details")
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
      >
        {drawerContent === "details" && selectedFacilityId && (
                  <FacilityInfoPanel facilityId={selectedFacilityId} onBack={closeDrawer} />
                )}
        {drawerContent === "add" && (
          <AddFacilityForm/>
        )}
      </RightDrawer>
    </div>
  )
}