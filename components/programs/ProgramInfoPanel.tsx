"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsForm from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedules";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, TrashIcon } from "lucide-react";
import { deleteProgram, updateProgram } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { Program } from "@/types/program";
import { revalidatePrograms } from "@/actions/serverActions";
import { ProgramRequestDto } from "@/app/api/Api";
import { Button } from "@/components/ui/button";

interface ProgramInfoPanelProps {
  program: Program;
  levels: string[];
  onClose?: () => void;
}

export default function ProgramInfoPanel({
  program,
  levels,
  onClose,
}: ProgramInfoPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");

  const { user } = useUser();

  const handleDeleteProgram = async () => {
    if (!confirm("Are you sure you want to delete this program?")) {
      return;
    }
    try {
      const error = await deleteProgram(program.id, user?.Jwt!);

      if (error === null) {
        toast({
          status: "success",
          description: "Practice updated successfully",
        });
        await revalidatePrograms();
        if (onClose) onClose();
      } else {
        toast({
          status: "error",
          description: `Error saving changes ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        status: "error",
        description: "Error deleting practice",
        variant: "destructive",
      });
    }
  };

  async function handleSaveAll(
    name: string,
    description: string,
    level: string,
    type: string,
    capacity: number
  ) {
    try {
      const programData: ProgramRequestDto = {
        name,
        description,
        level,
        type,
        capacity: capacity || 0,
      };

      const error = await updateProgram(program.id, programData, user?.Jwt!);

      if (error === null) {
        toast({
          status: "success",
          description: "Program updated successfully",
        });
        await revalidatePrograms();
      } else {
        toast({
          status: "error",
          description: `Error saving changes: ${error}`,
        });
      }
    } catch (error) {
      toast({ status: "error", description: `Error saving changes: ${error}` });
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
          <DetailsForm
            saveAction={handleSaveAll}
            program={program}
            levels={levels}
            DeleteButton={
              <Button
                variant="destructive"
                onClick={handleDeleteProgram}
                className="bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Program
              </Button>
            }
          />
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <ScheduleTab programID={program.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
