"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, SaveIcon, FileText, Calendar } from "lucide-react";
import { deleteProgram, updateProgram } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { Program } from "@/types/program";
import { revalidatePrograms } from "@/app/actions/serverActions";
import { useFormData } from "@/hooks/form-data";
import { getAllTeams } from "@/services/teams";
import { getAllLocations } from "@/services/location";
import { Location } from "@/types/location";
import { ProgramRequestDto } from "@/app/api/Api";

interface ProgramInfoPanelProps {
  practice: Program;
  levels: string[];
  onClose?: () => void; // Make this optional
}

export default function ProgramInfoPanel({ practice, levels, onClose }: ProgramInfoPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const { data, resetData, updateField } = useFormData({
    name: practice.name, 
    description: practice.description || "", 
    level: practice.level, 
    capacity: practice.capacity || 10,
    type: practice.type // Add the missing type field
  });

  const { user } = useUser();

  // Add useEffect to load required data
  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      try {
        // Load locations and teams
        const [locationsData, teamsData] = await Promise.all([
          getAllLocations(),
          getAllTeams()
        ]);
        
        setLocations(locationsData);
        setTeams(teamsData);

        // TODO: Load events for this program when API is available
        // const programEvents = await getEventsByProgramId(practice.id);
        // setEvents(programEvents);
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast({ 
          title: "Error", 
          description: "Failed to load some data. Some information may be incomplete.",
          variant: "destructive",
          status: "error"
        });
      } finally {
        setIsLoadingData(false);
      }
    }
    
    loadData();
  }, [practice.id, toast]);

  // Handle the updateField call with proper typing
  const handleUpdateField = (field: keyof ProgramRequestDto, value: string | number) => {
    updateField(field as any, value);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSaveAll = async () => {
    try {
      const practiceData = {
        description: data.description,
        name: data.name,
        level: data.level,
        capacity: data.capacity || 10, // Ensure capacity is never undefined
        type: data.type // Include the type field
      };

      const error = await updateProgram(practice.id, practiceData, user?.Jwt!)

      if (error === null) {
        toast({ status: "success", description: "Practice updated successfully" });
        await revalidatePrograms();
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
            events={events}
            onEventsChange={setEvents}
            locations={locations}
            teams={teams}
            programCapacity={data.capacity || 10}
          />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-full px-4 mx-auto flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Last updated: {practice.updated_at ? new Date(practice.updated_at).toLocaleString() : 'Never'}
        </p>

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