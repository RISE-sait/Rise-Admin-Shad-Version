"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Schedule } from "@/types/course";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { SaveIcon } from "lucide-react";
import { createPractice } from "@/services/practices";
import { useUser } from "@/contexts/UserContext";
import { useFormData } from "@/hooks/form-data";
import { revalidatePractices } from "@/app/actions/serverActions";

export default function AddPracticeForm({ levels }: { levels: string[] }) {
  const [activeTab, setActiveTab] = useState("details");
  const { data, resetData, updateField } = useFormData(
    { name: "", description: "", level: "all", capacity: 0 },
  )

  const { user } = useUser();

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleSaveAll = async () => {
    // Check if the course name is empty
    if (!data.name.trim()) {
      toast.error("Practice name is required.");
      return;
    }


    try {
      const error = await createPractice(data, user?.Jwt!)

      if (error === null) {

        resetData();

        await revalidatePractices()

        toast.success("Practice successfully created");

        return;
      }
      // const errorText = await response.text();
      // console.error("Failed to create practice:", errorText);
      toast.error(`Failed to create practice: ${error}. Please try again.`)
      return;


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
            details={data}
            updateField={updateField}
            levels={levels}
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