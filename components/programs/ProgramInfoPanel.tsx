"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar } from "lucide-react";
import { deleteProgram, updateProgram } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { Program } from "@/types/program";
import { revalidatePrograms } from "@/app/actions/serverActions";
import { useFormData } from "@/hooks/form-data";
import { ProgramRequestDto } from "@/app/api/Api";

interface ProgramInfoPanelProps {
  program: Program;
  levels: string[];
  onClose?: () => void; // Make this optional
}

export default function ProgramInfoPanel({ program, levels, onClose }: ProgramInfoPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");

  const { data, resetData, updateField } = useFormData({
    name: program.name,
    description: program.description || "",
    level: program.level,
    capacity: program.capacity || 0,
    type: program.type // Add the missing type field
  });

  const { user } = useUser();

  // Handle the updateField call with proper typing
  const handleUpdateField = (field: keyof ProgramRequestDto, value: string | number) => {
    updateField(field as any, value);
  };

  const handleDeletePractice = async () => {
    try {
      const error = await deleteProgram(program.id, user?.Jwt!)

      if (error === null) {
        toast({ status: "success", description: "Practice updated successfully" });
        await revalidatePrograms();
        if (onClose) onClose();
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
            updateField={handleUpdateField}
            levels={levels}
          />
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <ScheduleTab
            programID={program.id}
            capacity={program.capacity}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

