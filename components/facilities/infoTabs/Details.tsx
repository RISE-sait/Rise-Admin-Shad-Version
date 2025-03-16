"use client";
import { Input } from "@/components/ui/input";
import { BuildingIcon, PencilIcon, MapPinIcon } from "lucide-react";

export default function DetailsTab({
  details,
  onDetailsChange
}: {
  details: { name: string; Address: string };  // Changed to uppercase 'A' to match interface
  onDetailsChange: (details: { name: string; Address: string }) => void;  // Changed to uppercase 'A'
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-6">
          <BuildingIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Facility Information</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-base font-medium flex items-center gap-2">
              <PencilIcon className="h-5 w-5 text-muted-foreground" />
              Facility Name
            </label>
            <Input
              value={details.name}
              onChange={(e) => onDetailsChange({ ...details, name: e.target.value })}
              placeholder="Enter facility name"
              className="text-lg h-12 px-4"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-medium flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              Address
            </label>
            <Input
              value={details.Address}  // Changed to uppercase 'A' to match interface
              onChange={(e) => onDetailsChange({ ...details, Address: e.target.value })}  // Changed to uppercase 'A'
              placeholder="Enter facility address"
              className="text-lg h-12 px-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}