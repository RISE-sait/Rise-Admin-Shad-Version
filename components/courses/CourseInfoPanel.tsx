"use client"
// ...existing code...
// Removed MUI imports (Box, Typography, Tabs, etc.)
import React, { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Course } from "@/types/course"
import { Separator } from "../ui/separator"
import DetailsTab from "./infoTabs/Details"
// import SchedulesTab from "./infoTabs/Schedule"


export default function CourseInfoPanel({
  courseId,
  onBack,
}: {
  courseId: string
  onBack: () => void
}) {
  const [course, setCourse] = useState<Course | null>(null)
  const [tabValue, setTabValue] = useState("details")

  useEffect(() => {
    // Fetch the course details based on the courseId
    (async () => {
      const response = await fetch("http://localhost:8080/api/courses/" + courseId)

      if (!response.ok) {
        console.error("Failed to fetch course details")
        console.error(await response.text())
        return
      }

      const course = await response.json()

      setCourse(course)
    })()
  }, [courseId])

  if (!course) return <div>Loading...</div>

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
        {/* <TabsContent value="schedule">
          <SchedulesTab courseId={courseId} />
        </TabsContent> */}
{/*
        <TabsContent value="classes">
          {client.classes && <ClassesTab classes={client.classes} />}
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>

        <TabsContent value="notes">
          <Notes />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}