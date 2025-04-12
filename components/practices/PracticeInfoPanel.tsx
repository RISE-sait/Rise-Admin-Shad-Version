"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon, FileText, Calendar } from "lucide-react";
import { deleteProgram, updateProgram } from "@/services/practices";
import { useUser } from "@/contexts/UserContext";
import { Practice } from "@/types/practice";
import { PracticeRequestDto } from "@/app/api/Api";
import { revalidatePractices } from "@/app/actions/serverActions";
import { useFormData } from "@/hooks/form-data";

export default function PracticeInfoPanel({ practice, levels }: { practice: Practice, levels: string[] }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");

  const { data, resetData, updateField } = useFormData(
    { name: practice.name, description: practice.description || "", level: practice.level, capacity: practice.capacity },
  )

  const { user } = useUser();

  const handleSaveAll = async () => {
    try {

      const practiceData: PracticeRequestDto = {
        description: data.description,
        name: data.name,
        level: data.level,
        capacity: data.capacity
      }

      const error = await updateProgram(practice.id, practiceData, user?.Jwt!)

      if (error === null) {
        toast({ status: "success", description: "Practice updated successfully" });
        await revalidatePractices();
      }
      else {
        toast({ status: "error", description: `Error saving changes ${error}`, variant: "destructive" });
      }
    } catch (error) {
      toast({ status: "error", description: `Error saving changes ${error}`, variant: "destructive" });
    }
  }

  const handleDeletePractice = async () => {
    try {
      const error = await deleteProgram(practice.id, user?.Jwt!)
      
      if (error === null) {
        toast({ status: "success", description: "Practice updated successfully" });
        await revalidatePractices();
      }
      else {
        toast({ status: "error", description: `Error saving changes ${error}`, variant: "destructive" });
      }
    } catch (error) {
      toast({ status: "error", description: "Error deleting practice", variant: "destructive" });
    }
  }

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
        <div className="max-w-full px-4 mx-auto flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Last updated: {practice.updatedAt ? new Date(practice.updatedAt).toLocaleString() : 'Never'}</p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleDeletePractice}
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