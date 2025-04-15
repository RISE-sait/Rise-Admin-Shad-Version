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
import { ProgramRequestDto } from "@/app/api/Api";

interface DetailsTabProps {
  details: ProgramRequestDto;
  updateField: any; // Change to 'any' to accept any update function
  levels: string[];
}

export default function DetailsTab({ details, updateField, levels }: DetailsTabProps) {
  const handleChangeField = (field: keyof ProgramRequestDto, value: string | number) => {
    updateField(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Program Name</Label>
          <Input
            id="name"
            placeholder="Enter program name"
            value={details.name}
            onChange={(e) => handleChangeField("name", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter program description"
            value={details.description}
            onChange={(e) => handleChangeField("description", e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={details.level}
            onValueChange={(value) => handleChangeField("level", value)}
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
            value={details.type}
            onValueChange={(value) => handleChangeField("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="game">Game</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="camp">Camp</SelectItem>
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
            value={details.capacity || ""}
            onChange={(e) => handleChangeField("capacity", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
}