import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import ScheduleTab from "./infoTabs/Schedule";
import { SaveIcon, Loader2, X } from "lucide-react";
import { createProgram, getAllPrograms } from "@/services/program";
import { createEvents } from "@/services/events";
import { useUser } from "@/contexts/UserContext";
import { useFormData } from "@/hooks/form-data";
import { revalidatePrograms } from "@/app/actions/serverActions";
import { Location } from "@/types/location";
import { getAllTeams, Team } from "@/services/teams";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EventCreateRequestDto, ProgramRequestDto } from "@/app/api/Api";
import { EventRequestDto } from "@/app/api/Api";

export default function AddProgramForm({ 
  levels, 
  initialLocations = [],
  onClose 
}: { 
  levels: string[],
  initialLocations?: Location[],
  onClose?: () => void
}) {
  const [activeTab, setActiveTab] = useState("details");
  const { data, resetData, updateField } = useFormData<ProgramRequestDto>({
    name: "",
    description: "",
    level: "all",
    type: "practice",
    capacity: 10
  });

  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Events that will be created for this program
  const [eventsDto, setEvents] = useState<EventRequestDto[]>([]);
  
  // Use the server-provided locations
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      try {
        // Only fetch teams since locations are provided via props
        const teamsData = await getAllTeams();
        setTeams(teamsData || []);
      } catch (error) {
        console.error("Error loading teams data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    
    loadData();
  }, []);

  const handleSaveAll = async () => {
    // Check if the program name is empty
    if (!data.name.trim()) {
      toast({ 
        title: "Error",
        description: "Program name is required.",
        variant: "destructive" ,
        status: "error"
      });
      return;
    }

    // Validate type field
    if (!data.type) {
      updateField("type", "practice"); // Set default if missing
    }

    setIsLoading(true);
    try {
      // 1. First create the program
      const programData: ProgramRequestDto = {
        name: data.name,
        description: data.description,
        level: data.level,
        capacity: data.capacity,
        type: data.type
      };

      // Create program
      const programError = await createProgram(programData, user?.Jwt!);

      if (programError !== null) {
        toast({ 
          title: "Error",
          description: `Failed to create program: ${programError}`,
          variant: "destructive" ,
          status: "error"
        });
        setIsLoading(false);
        return;
      }

      // Get the newly created program
      const programs = await getAllPrograms();
      const newProgram = programs.find(p => p.name === data.name && p.type === data.type);
      
      if (!newProgram) {
        toast({ 
          title: "Success",
          description: "Program created successfully, but couldn't retrieve it to create events.",
          status: "success"
        });
        setIsLoading(false);
        resetData();
        await revalidatePrograms();
        if (onClose) onClose();
        return;
      }

      // 2. Create all events for this program if any
      if (eventsDto.length > 0) {

        const createEventsDto: EventCreateRequestDto = {
          events: eventsDto
        }

        const eventError = await createEvents(createEventsDto, user?.Jwt!);

        // Show appropriate message for event creation
        if (eventError != null) {
          toast({
            title: "Warning",
            description: `Program created but failed to create events: ${eventError}.`,
            variant: "default",
            status: "warning"
          });
        } else {
          toast({
            title: "Success",
            description: `Program and ${eventsDto.length} events created successfully!`,
            variant: "default",
            status: "success"
          });
        }
      } else {
        // Just program created, no events
        toast({ 
          title: "Success",
          description: "Program created successfully! No events were scheduled.",
          variant: "default" ,
          status: "success"
        });
      }
      
      // Reset form and reload data
      resetData();
      setEvents([]);
      await revalidatePrograms();
      if (onClose) onClose();
      
    } catch (error) {
      console.error("Error during program creation:", error);
      toast({ 
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive" ,
        status: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl">Add New Program</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-muted/50">
            <TabsTrigger value="details">Program Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Events</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-4">
            <DetailsTab
              details={data}
              updateField={updateField}
              levels={levels}
            />
          </TabsContent>

          <TabsContent value="schedule" className="pt-4">
            {isLoadingData ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScheduleTab
                events={eventsDto}
                onEventsChange={setEvents}
                locations={locations}
                teams={teams}
                programCapacity={data.capacity || 10}
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
          <div className="flex justify-between px-4">
            <p className="text-sm text-muted-foreground">
              {eventsDto.length > 0 
                ? `${eventsDto.length} event${eventsDto.length === 1 ? '' : 's'} will be created with this program` 
                : 'No events scheduled yet'}
            </p>
            <Button
              onClick={handleSaveAll}
              className="gap-2 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
              Create Program
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}