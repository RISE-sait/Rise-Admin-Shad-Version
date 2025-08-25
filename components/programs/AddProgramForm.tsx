import React from "react";
import { useToast } from "@/hooks/use-toast";
import DetailsForm from "./infoTabs/Details";
import { createProgram } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgramRequestDto } from "@/app/api/Api";
import { revalidatePrograms } from "@/actions/serverActions";

export default function AddProgramForm({
  levels,
  onSuccess,
}: {
  levels: string[];
  onSuccess?: () => void;
}) {
  const { user } = useUser();
  const { toast } = useToast();

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

      // Create program
      const programError = await createProgram(programData, user?.Jwt!);

      if (programError !== null) {
        toast({
          title: "Error",
          description: `Failed to create program: ${programError}`,
          variant: "destructive",
          status: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Program created successfully.",
        status: "success",
      });
      await revalidatePrograms();
      onSuccess?.();
      return;
    } catch (error) {
      console.error("Error during program creation:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
        status: "error",
      });
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"></CardHeader>
      <CardContent>
        <DetailsForm
          program={{
            name: "",
            description: "",
            level: "",
            type: "",
            capacity: 0,
          }}
          saveAction={handleSaveAll}
          levels={levels}
        />
      </CardContent>
    </Card>
  );
}
