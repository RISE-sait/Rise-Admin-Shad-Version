"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Course, Schedule } from "@/types/course";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CourseInfoPanel({ course }: { course: Course }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [courseDetails, setCourseDetails] = useState({
    name: course.name,
    description: course.description || ""
  });
  const [schedules, setSchedules] = useState<Schedule[]>(course.schedules || []);

  const handleSaveAll = async () => {
    try {
      // Save course details
      const detailsResponse = await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseDetails)
      });

      if (!detailsResponse.ok) throw new Error("Failed to save course details");

      // Save schedules
      const schedulesResponse = await fetch(`/api/courses/${course.id}/schedules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedules)
      });

      if (!schedulesResponse.ok) throw new Error("Failed to save schedules");

      toast({ status: "success", description: "All changes saved successfully" });
    } catch (error) {
      toast({ status: "error", description: "Error saving changes", variant: "destructive" });
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete course");
      
      toast({ status: "success", description: "Course deleted successfully" });
      // Add redirect or refresh logic here
    } catch (error) {
      toast({ status: "error", description: "Error deleting course", variant: "destructive" });
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
            schedules={schedules}
            onSchedulesChange={setSchedules}
          />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-[-30] bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center gap-4">
        <Button
          variant="destructive"
          onClick={handleDeleteCourse}
          className="gap-2 flex-shrink-0"
        >
          <TrashIcon className="h-4 w-4" />
          Delete Course
        </Button>
        
        <Button
          onClick={handleSaveAll}
          className="gap-2 bg-green-600 hover:bg-green-700 flex-shrink-0"
        >
          <SaveIcon className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>
    </div>
    </div>
  );
}