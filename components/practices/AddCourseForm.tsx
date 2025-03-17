"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import getValue from "../../configs/constants";
import { Schedule } from "@/types/course";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { SaveIcon } from "lucide-react";

export default function AddCourseForm() {
  const [activeTab, setActiveTab] = useState("details");
  const [courseDetails, setCourseDetails] = useState({
    name: "",
    description: ""
  });
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const apiUrl = getValue("API");

  const handleSaveAll = async () => {
    // Check if the course name is empty
    if (!courseDetails.name.trim()) {
      toast.error("Course name is required.");
      return;
    }

    const courseData = {
      ...courseDetails,
      schedules
    };

    try {
      const response = await fetch(apiUrl + `/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save course:", errorText);
        toast.error("Failed to save course. Please try again.");
        return;
      }

      toast.success("Course successfully created");
    } catch (error) {
      console.error("Error during API request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-muted/50">
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <DetailsTab
            details={courseDetails}
            onDetailsChange={setCourseDetails}
          />
        </TabsContent>
        
        <TabsContent value="schedule" className="pt-4">
          <ScheduleTab
            // schedules={schedules}
            // onSchedulesChange={setSchedules}
          />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="flex justify-end px-4">
          <Button
            onClick={handleSaveAll}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <SaveIcon className="h-4 w-4" />
            Create Course
          </Button>
        </div>
      </div>
    </div>
  );
}