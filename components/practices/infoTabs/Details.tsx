"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DetailsTab({
  details,
  updateField,
  levels
}: {
  details: { name: string; description: string, level: string, capacity: number };
  updateField: (key: "name" | "description" | "level" | "capacity", value: string | number) => void
  levels: string[];
}) {

  return (
    <div className="space-y-8">
      <div className="space-y-2">

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-base font-medium flex items-center gap-2">
              <PencilIcon className="h-5 w-5 text-muted-foreground" />
              Practice Name
            </label>
            <Input
              value={details.name}
              onChange={(e) => updateField("name", e.target.value )}
              placeholder="Enter practice name"
              className="text-lg h-12 px-4"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-medium flex items-center gap-2">
              <PencilIcon className="h-5 w-5 text-muted-foreground" />
              Description
            </label>
            <Textarea
              value={details.description}
              onChange={(e) => updateField("description", e.target.value )}
              placeholder="Describe the practice content and objectives"
              className="min-h-[150px] text-base p-4"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-medium flex items-center gap-2">
              <PencilIcon className="h-5 w-5 text-muted-foreground" />
              Capacity
            </label>
            <Input
              value={details.capacity}
              type="number"
              onChange={(e) => updateField("capacity", parseInt(e.target.value) )}
              placeholder="Enter capacity"
              className="text-lg h-12 px-4"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor={`plan-frequency-${details.name}`} className="text-sm font-medium">
              Level
            </Label>
            <Select
              value={details.level || 'monthly'}
              onValueChange={(value) => updateField('level', value)}
            >
              <SelectTrigger id={`level-${details.name}`}>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {
                  levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}