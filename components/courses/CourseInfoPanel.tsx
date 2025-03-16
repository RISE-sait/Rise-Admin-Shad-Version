"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Course, Schedule } from "@/types/course";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon, FileText, Calendar } from "lucide-react";

// Dummy schedule data
const dummySchedules: Schedule[] = [
  {
    name: "Morning Batch",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-05-30"),
    capacity: 25,
    days: [
      {
        day: "MON",
        startTime: "09:00",
        endTime: "11:30",
        location: "Training Room A",
        trainer: "John Smith"
      },
      {
        day: "WED",
        startTime: "09:00",
        endTime: "11:30",
        location: "Training Room A",
        trainer: "John Smith"
      },
      {
        day: "FRI",
        startTime: "09:00",
        endTime: "11:30",
        location: "Training Room A",
        trainer: "John Smith"
      }
    ]
  },
  {
    name: "Evening Batch",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-05-30"),
    capacity: 20,
    days: [
      {
        day: "TUE",
        startTime: "18:00",
        endTime: "20:30",
        location: "Training Room B",
        trainer: "Sarah Johnson"
      },
      {
        day: "THU",
        startTime: "18:00",
        endTime: "20:30",
        location: "Training Room B",
        trainer: "Sarah Johnson"
      }
    ]
  }
];

export default function CourseInfoPanel({ course }: { course: Course }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [courseDetails, setCourseDetails] = useState({
    name: course.name,
    description: course.description || ""
  });
  
  // Initialize with dummy schedules if no schedules exist
  const [schedules, setSchedules] = useState<Schedule[]>(
    course.schedules?.length ? course.schedules : dummySchedules
  );

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
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger 
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <FileText className="h-4 w-4" />
              Information
            </TabsTrigger>
            <TabsTrigger 
              value="schedule"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>
        </div>
        
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

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
      <div className="max-w-full px-4 mx-auto flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Last updated: {course.updatedAt ? new Date(course.updatedAt).toLocaleString() : 'Never'}</p>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleDeleteCourse}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
          
          <Button
            onClick={handleSaveAll}
            className="bg-green-600 hover:bg-green-700"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}