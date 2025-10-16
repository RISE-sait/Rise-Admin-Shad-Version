import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DetailsForm from "./infoTabs/Details";
import { createProgram, updateProgram } from "@/services/program";
import { useUser } from "@/contexts/UserContext";
import { ProgramRequestDto } from "@/app/api/Api";
import { revalidatePrograms } from "@/actions/serverActions";
import { uploadProgramPhoto } from "@/services/upload";

export default function AddProgramForm({
  levels,
  onSuccess,
}: {
  levels: string[];
  onSuccess?: () => void;
}) {
  const { user } = useUser();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string>("");

  const handlePhotoChange = (file: File | null, previewUrl: string | null) => {
    if (file && previewUrl) {
      setPhotoFile(file);
      setPhotoPreview(previewUrl);
      setPhotoName(file.name);
    } else {
      setPhotoFile(null);
      setPhotoPreview("");
      setPhotoName("");
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

      // Create program
      const { error: programError, program: createdProgram } =
        await createProgram(programData, user?.Jwt!);

      if (programError !== null) {
        toast({
          title: "Error",
          description: `Failed to create program: ${programError}`,
          variant: "destructive",
          status: "error",
        });
        return;
      }

      let uploadErrorMessage: string | null = null;

      if (photoFile) {
        if (!createdProgram?.id) {
          uploadErrorMessage =
            "Program created but missing program ID for photo upload.";
        } else {
          try {
            const uploadedUrl = await uploadProgramPhoto(
              photoFile,
              createdProgram.id,
              user?.Jwt!
            );

            const updateError = await updateProgram(
              createdProgram.id,
              {
                ...programData,
                photo_url: uploadedUrl,
              },
              user?.Jwt!
            );

            if (updateError !== null) {
              uploadErrorMessage = `Program photo save failed: ${updateError}`;
            }
          } catch (error) {
            console.error("Error uploading program photo:", error);
            uploadErrorMessage =
              error instanceof Error
                ? error.message
                : "Failed to upload program photo.";
          }
        }
      }

      if (uploadErrorMessage) {
        toast({
          title: "Program created",
          description: uploadErrorMessage,
          variant: "destructive",
          status: "error",
        });
      } else {
        toast({
          title: "Success",
          description: "Program created successfully.",
          status: "success",
        });
      }

      await revalidatePrograms();
      onSuccess?.();
      setPhotoFile(null);
      setPhotoPreview("");
      setPhotoName("");
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
    <div className="pt-3">
      <DetailsForm
        program={{
          name: "",
          description: "",
          level: "",
          type: "",
          capacity: 0,
          photo_url: "",
        }}
        saveAction={handleSaveAll}
        levels={levels}
        photoUrl={photoPreview}
        photoName={photoName}
        onPhotoChange={handlePhotoChange}
      />
    </div>
  );
}
