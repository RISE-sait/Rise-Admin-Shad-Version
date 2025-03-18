"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "lucide-react";

export default function DetailsTab({
  details,
  onDetailsChange
}: {
  details: { name: string; description: string };
  onDetailsChange: (details: { name: string; description: string }) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-base font-medium flex items-center gap-2">
              <PencilIcon className="h-5 w-5 text-muted-foreground" />
              Membership Name
            </label>
            <Input
              value={details.name}
              onChange={(e) => onDetailsChange({ ...details, name: e.target.value })}
              placeholder="Enter membership name"
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
              onChange={(e) => onDetailsChange({ ...details, description: e.target.value })}
              placeholder="Describe the membership benefits and features"
              className="min-h-[150px] text-base p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}