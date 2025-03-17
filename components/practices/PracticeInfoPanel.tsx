"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon, FileText, Calendar } from "lucide-react";
import { deletePractice, updatePractice } from "@/services/practices";
import { useUser } from "@/contexts/UserContext";
import { Practice } from "@/types/practice";
import { DtoPracticeRequestDto } from "@/app/api/Api";
import { revalidatePractices } from "@/app/actions/serverActions";

export default function PracticeInfoPanel({ practice }: { practice: Practice }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [practiceDetails, setPracticeDetails] = useState({
    name: practice.name,
    description: practice.description || ""
  });

    const { user } = useUser();
  
  // Initialize with dummy schedules if no schedules exist
  // const [schedules, setSchedules] = useState<Schedule[]>(
  //   course.schedules?.length ? course.schedules : dummySchedules
  // );

  const handleSaveDetails = async () => {
    try {
      
      const practiceData: DtoPracticeRequestDto = {
        description: practiceDetails.description,
        name: practiceDetails.name
      }

      await updatePractice(practice.id, practiceData, user?.Jwt!);
      toast({ status: "success", description: "Practice updated successfully" });
      await revalidatePractices();
    } catch (error) {
      toast({ status: "error", description: "Error saving changes", variant: "destructive" });
    }
  }
      // // Save schedules
      // const schedulesResponse = await fetch(`/api/courses/${course.id}/schedules`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(schedules)
      // });

      // if (!schedulesResponse.ok) throw new Error("Failed to save schedules");

  //     toast({ status: "success", description: "All changes saved successfully" });
  //   } catch (error) {
  //     toast({ status: "error", description: "Error saving changes", variant: "destructive" });
  //   }
  // };

  const handleDeletePractice = async () => {
    try {
      await deletePractice(practice.id, user?.Jwt!)
      toast({ status: "success", description: "Practice deleted successfully" });
      await revalidatePractices();
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
            details={practiceDetails}
            onDetailsChange={setPracticeDetails}
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
            onClick={handleSaveDetails}
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