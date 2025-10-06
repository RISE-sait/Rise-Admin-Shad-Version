import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { Program } from "@/types/program";
import { useForm } from "react-hook-form";
import { JSX } from "react";
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
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Program Name</Label>
          <Input
            id="name"
            {...register("name", {
              pattern: {
                value: PROGRAM_TEXT_INPUT_REGEX,
                message: PROGRAM_TEXT_INPUT_MESSAGE,
              },
              onChange: (event) => {
                const sanitizedValue = sanitizeProgramText(event.target.value);
                if (sanitizedValue !== event.target.value) {
                  event.target.value = sanitizedValue;
                }
              },
            })}
            placeholder="Enter program name"
            pattern={PROGRAM_TEXT_INPUT_PATTERN}
            title={PROGRAM_TEXT_INPUT_MESSAGE}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
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
                const sanitizedValue = sanitizeProgramText(event.target.value, {
                  allowNewLines: true,
                });
                if (sanitizedValue !== event.target.value) {
                  event.target.value = sanitizedValue;
                }
              },
            })}
            className="min-h-[100px]"
            title={PROGRAM_TEXT_INPUT_MESSAGE}
            aria-invalid={errors.description ? "true" : "false"}
          />
          {errors.description && (
            <p className="text-sm text-destructive" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="level">Level</Label>
          <Select
            defaultValue={program.level}
            onValueChange={(value) => setValue("level", value)}
          >
            <SelectTrigger id="level">
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

        <div className="grid gap-2">
          <Label htmlFor="type">Program Type</Label>
          <Select
            defaultValue={program.type}
            onValueChange={(value) => setValue("type", value)}
          >
            <SelectTrigger id="type">
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

        <div className="grid gap-2">
          <Label htmlFor="capacity">Default Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            placeholder="NULL"
            {...register("capacity", { valueAsNumber: true })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>

          {DeleteButton && DeleteButton}
        </div>
      </div>
    </div>
  );
}
