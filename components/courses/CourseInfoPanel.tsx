"use client"
// ...existing code...
// Removed MUI imports (Box, Typography, Tabs, etc.)
import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Course } from "@/types/course"
import { Separator } from "../ui/separator"
import DetailsTab from "./infoTabs/Details"
import SchedulesTab from "./infoTabs/Schedule"

export default function CourseInfoPanel({
  course,
}: {
  course: Course
}) {
  const [tabValue, setTabValue] = useState("details")

  return (
    <div className="p-4 space-y-8">

      <div>
        <p className="text-base font-semibold">{course.name}</p>
      </div>
      <Separator />
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="flex justify-between space-x-10">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <DetailsTab course={course} />
        </TabsContent>
        <TabsContent value="schedule">
          <SchedulesTab courseId={course.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}