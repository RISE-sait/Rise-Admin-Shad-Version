import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import DetailsForm from "./infoTabs/Details";
import { X } from "lucide-react";
import { createProgram } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ProgramRequestDto } from "@/app/api/Api";
import { revalidatePrograms } from "@/actions/serverActions";

export default function AddProgramForm({
  levels,
  onClose
}: {
  levels: string[],
  onClose?: () => void
}) {

  const { user } = useUser();
  const { toast } = useToast();

  async function handleSaveAll(name: string, description: string, level: string, type: string, capacity: number) {

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
          status: "error"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Program created successfully.",
        status: "success"
      })
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
        <DetailsForm
          program={
            {
              name: "",
              description: "",
              level: "",
              type: "",
              capacity: 0,
            }
          }
          saveAction={handleSaveAll}
          levels={levels}
        />

      </CardContent>
    </Card>
  );
}