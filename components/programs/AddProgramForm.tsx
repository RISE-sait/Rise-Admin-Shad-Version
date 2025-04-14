import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTab from "./infoTabs/Details";
import { SaveIcon, Loader2, X } from "lucide-react";
import { createProgram, getAllPrograms } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { useFormData } from "@/hooks/form-data";
import { revalidatePrograms } from "@/app/actions/serverActions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgramRequestDto } from "@/app/api/Api";

export default function AddProgramForm({
  levels,
  onClose
}: {
  levels: string[],
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

  const handleSaveAll = async () => {
    // Check if the program name is empty
    if (!data.name.trim()) {
      toast({
        title: "Error",
        description: "Program name is required.",
        variant: "destructive",
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
          variant: "destructive",
          status: "error"
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Program created successfully.",
        status: "success"
      })
      setIsLoading(false);
      resetData();
      await revalidatePrograms();
      if (onClose) onClose();
      return;
    } catch (error) {
      console.error("Error during program creation:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
        status: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DetailsTab
          details={data}
          updateField={updateField}
          levels={levels}
        />
        <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
          <div className="flex justify-between px-4">
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