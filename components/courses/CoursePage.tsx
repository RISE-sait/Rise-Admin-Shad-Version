"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RightDrawer from "../reusable/RightDrawer"
import CourseTable from "./CourseTable"
import AddClientForm from "./AddCourseForm"
import { useDrawer } from "../../hooks/drawer"
import { Course } from "@/types/course"
import SearchBar from "../reusable/SearchBar"
import CourseInfoPanel from "./CourseInfoPanel"
import AddCourseForm from "./AddCourseForm"

export default function CoursesPage({ courses }: { courses: Course[] }) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer()

  const handleCourseSelect = (id: string) => {
    setSelectedCourseId(id)
    openDrawer("details")
  }
  
  return (
    <div className="p-6 flex">
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Courses</h1>
        <div className="flex items-center gap-2 mb-4">
          <SearchBar placeholderText="Search Courses"/>
          <Button variant="outline" onClick={() => openDrawer("add")} className="ml-auto">
            Add Course
          </Button>
        </div>
        <CourseTable courses={courses} onCourseSelect={handleCourseSelect} />
      </div>
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={closeDrawer}
      >
        {drawerContent === "details" && selectedCourseId && (
          <CourseInfoPanel courseId={selectedCourseId} onBack={closeDrawer} />
        )}
        {drawerContent === "add" && (
          <AddCourseForm/>
        )}
      </RightDrawer>
    </div>
  )
}