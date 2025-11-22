import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SaveIcon, FileText, Layers, ImageIcon } from "lucide-react";
import { Program } from "@/types/program";
import { useForm } from "react-hook-form";
import { JSX, ChangeEvent } from "react";
import {
  PROGRAM_TEXT_INPUT_MESSAGE,
  PROGRAM_TEXT_INPUT_PATTERN,
  PROGRAM_TEXT_INPUT_REGEX,
  PROGRAM_TEXT_AREA_REGEX,
  sanitizeProgramText,
} from "@/lib/programValidation";

export default function DetailsForm({
  saveAction,
  program,
  levels,
  DeleteButton,
  photoUrl,
  photoName,
  onPhotoChange,
  isReceptionist = false,
}: {
  saveAction: (
    name: string,
    description: string,
    level: string,
    type: string,
    capacity: number
  ) => Promise<void>;
  program: Omit<Program, "id" | "created_at" | "updated_at">;
  levels: string[];
  DeleteButton?: JSX.Element;
  photoUrl?: string;
  photoName?: string;
  onPhotoChange?: (file: File | null, previewUrl: string | null) => void;
  isReceptionist?: boolean;
}) {
  const {
    register,
    getValues,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Program>({
    defaultValues: {
      ...program,
      name: sanitizeProgramText(program.name),
      description: sanitizeProgramText(program.description, {
        allowNewLines: true,
      }),
    },
  });

  const currentType = watch("type");
  const currentLevel = watch("level");

  const handlePhotoInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onPhotoChange) {
      return;
    }

    const file = event.target.files?.[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onPhotoChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onPhotoChange(null, null);
    }

    event.target.value = "";
  };

  const handleSubmit = async () => {
    const isValid = await trigger(["name", "description"]);

    if (!isValid) {
      return;
    }
    const name = getValues("name");
    const description = getValues("description");
    const level = getValues("level");
    const type = getValues("type");
    const capacity = getValues("capacity") || 0;

    await saveAction(name, description, level, type, capacity);
  };

  return (
    <div className="space-y-6">
      {/* Program Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Program Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Program Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name", {
                  pattern: {
                    value: PROGRAM_TEXT_INPUT_REGEX,
                    message: PROGRAM_TEXT_INPUT_MESSAGE,
                  },
                  onChange: (event) => {
                    const sanitizedValue = sanitizeProgramText(
                      event.target.value
                    );
                    if (sanitizedValue !== event.target.value) {
                      event.target.value = sanitizedValue;
                    }
                  },
                })}
                placeholder="Enter program name"
                pattern={PROGRAM_TEXT_INPUT_PATTERN}
                title={PROGRAM_TEXT_INPUT_MESSAGE}
                aria-invalid={errors.name ? "true" : "false"}
                className="bg-background"
                disabled={isReceptionist}
              />
              {errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter program description"
                {...register("description", {
                  pattern: {
                    value: PROGRAM_TEXT_AREA_REGEX,
                    message: PROGRAM_TEXT_INPUT_MESSAGE,
                  },
                  onChange: (event) => {
                    const sanitizedValue = sanitizeProgramText(
                      event.target.value,
                      {
                        allowNewLines: true,
                      }
                    );
                    if (sanitizedValue !== event.target.value) {
                      event.target.value = sanitizedValue;
                    }
                  },
                })}
                className="min-h-[100px] bg-background"
                title={PROGRAM_TEXT_INPUT_MESSAGE}
                aria-invalid={errors.description ? "true" : "false"}
                disabled={isReceptionist}
              />
              {errors.description && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Program Photo</h3>
          </div>
          <div className="space-y-2">
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-background">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoInputChange}
                className="hidden"
                id="program-photo-upload"
                disabled={isReceptionist}
              />
              <label
                htmlFor="program-photo-upload"
                className={`block ${!isReceptionist ? 'cursor-pointer' : 'cursor-not-allowed'} text-muted-foreground ${!isReceptionist ? 'hover:text-foreground' : ''} transition-colors`}
              >
                {photoUrl ? (
                  <div className="space-y-2">
                    <p className="text-foreground font-medium">
                      {photoName || "Image selected"}
                    </p>
                    <p className="text-sm">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>Click to select an image</p>
                    <p className="text-sm">(JPG, PNG, WebP formats accepted)</p>
                  </div>
                )}
              </label>
            </div>
            {photoUrl && (
              <div className="flex justify-center">
                <img
                  src={photoUrl}
                  alt="Program photo preview"
                  className="max-h-40 rounded object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Program Configuration Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Program Configuration</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="level">
                Level <span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue={program.level}
                onValueChange={(value) => setValue("level", value)}
                disabled={isReceptionist}
              >
                <SelectTrigger id="level" className="bg-background">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                Program Type <span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue={program.type}
                onValueChange={(value) => setValue("type", value)}
                disabled={isReceptionist}
              >
                <SelectTrigger id="type" className="bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="tryouts">Tryouts</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Default Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                placeholder="NULL"
                {...register("capacity", { valueAsNumber: true })}
                className="bg-background"
                disabled={isReceptionist}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {!isReceptionist && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {DeleteButton && DeleteButton}
          <Button
            onClick={handleSubmit}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
