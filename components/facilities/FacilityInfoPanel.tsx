"use client"
// ...existing code...
// Removed MUI imports (Box, Typography, Tabs, etc.)
import React, { JSX, useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "../ui/separator"
import { Facility } from "@/types/facility"
import DetailsTab from "./infoTabs/Details"
import SchedulesTab from "./infoTabs/Schedule"


export default function FacilityInfoPanel({
    facilityId,
    onBack,
}: {
    facilityId: string
    onBack: () => void
}) {
    const [facility, setFacility] = useState<Facility | null>(null)
    const [tabValue, setTabValue] = useState("details")

    useEffect(() => {
        // Fetch the course details based on the courseId
        (async () => {
            const response = await fetch("/api/facilities/" + facilityId)

            if (!response.ok) {
                console.error("Failed to fetch facility details")
                console.error(await response.text())
                return
            }

            const course = await response.json()

            setFacility(course)
        })()
    }, [facilityId])

    if (!facility) return <div>Loading...</div>

    return (
        <div className="p-4 space-y-8">

            <div>
                <p className="text-base font-semibold">{facility.name}</p>
            </div>
            <Separator />
            <Tabs value={tabValue} onValueChange={setTabValue}>
                <TabsList className="flex justify-between space-x-10">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <DetailsTab facility={facility} />
                </TabsContent>

                <TabsContent value="schedule">
                    <SchedulesTab facilityId={facility.id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}