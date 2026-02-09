"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

interface DateOfBirthInputProps {
  value: DateOfBirth;
  onChange: (value: DateOfBirth) => void;
  label?: string;
  required?: boolean;
}

export function DateOfBirthInput({
  value,
  onChange,
  label = "Date of Birth",
  required = false,
}: DateOfBirthInputProps) {
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    onChange({ ...value, day: val });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    onChange({ ...value, month: val });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    onChange({ ...value, year: val });
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2 items-end">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Day</span>
          <Input
            placeholder="DD"
            className="w-20 text-center"
            maxLength={2}
            value={value.day}
            onChange={handleDayChange}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Month</span>
          <Input
            placeholder="MM"
            className="w-20 text-center"
            maxLength={2}
            value={value.month}
            onChange={handleMonthChange}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Year</span>
          <Input
            placeholder="YYYY"
            className="w-24 text-center"
            maxLength={4}
            value={value.year}
            onChange={handleYearChange}
          />
        </div>
      </div>
    </div>
  );
}

export function formatDateOfBirth(dob: DateOfBirth): string {
  return `${dob.year}-${dob.month.padStart(2, "0")}-${dob.day.padStart(2, "0")}`;
}
