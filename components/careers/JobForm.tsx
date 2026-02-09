"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, AlertCircle, Plus, X } from "lucide-react";
import { format } from "date-fns";
import type {
  Job,
  CreateJobRequest,
  EmploymentType,
  LocationType,
} from "@/types/careers";

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  saving: boolean;
  onSave: (data: CreateJobRequest) => void;
}

interface FormErrors {
  title?: string;
  position?: string;
  description?: string;
  salary?: string;
  closing_date?: string;
}

// List input component for responsibilities, requirements, etc.
function ListInput({
  label,
  placeholder,
  examples,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  examples?: string[];
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Show examples when no items added yet */}
      {items.length === 0 && examples && examples.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <span>Examples: </span>
          {examples.map((ex, i) => (
            <span key={i}>
              <button
                type="button"
                onClick={() => onChange([...items, ex])}
                className="text-primary hover:underline"
              >
                {ex}
              </button>
              {i < examples.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}

      {/* Existing items */}
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
            >
              <span className="flex-1">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new item */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addItem}
          disabled={!newItem.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function JobForm({
  open,
  onOpenChange,
  job,
  saving,
  onSave,
}: JobFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    position: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    nice_to_have: string[];
    employment_type: EmploymentType;
    location_type: LocationType;
    show_salary: boolean;
    salary_min: number;
    salary_max: number;
    closing_date: string;
  }>({
    title: "",
    position: "",
    description: "",
    responsibilities: [],
    requirements: [],
    nice_to_have: [],
    employment_type: "full_time",
    location_type: "on_site",
    show_salary: false,
    salary_min: 0,
    salary_max: 0,
    closing_date: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when opening/closing or when job changes
  useEffect(() => {
    if (open) {
      setErrors({});
      setTouched({});
      if (job) {
        setFormData({
          title: job.title,
          position: job.position,
          description: job.description,
          responsibilities: job.responsibilities || [],
          requirements: job.requirements || [],
          nice_to_have: job.nice_to_have || [],
          employment_type: job.employment_type,
          location_type: job.location_type,
          show_salary: job.show_salary,
          salary_min: job.salary_min ? parseFloat(job.salary_min) : 0,
          salary_max: job.salary_max ? parseFloat(job.salary_max) : 0,
          closing_date: job.closing_date
            ? format(new Date(job.closing_date), "yyyy-MM-dd")
            : "",
        });
      } else {
        setFormData({
          title: "",
          position: "",
          description: "",
          responsibilities: [],
          requirements: [],
          nice_to_have: [],
          employment_type: "full_time",
          location_type: "on_site",
          show_salary: false,
          salary_min: 0,
          salary_max: 0,
          closing_date: "",
        });
      }
    }
  }, [open, job]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position/Department is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    // Salary validation
    if (formData.show_salary) {
      if (formData.salary_min < 0 || formData.salary_max < 0) {
        newErrors.salary = "Salary cannot be negative";
      } else if (formData.salary_max > 0 && formData.salary_min > formData.salary_max) {
        newErrors.salary = "Minimum salary cannot be greater than maximum salary";
      }
    }

    // Closing date validation
    if (formData.closing_date) {
      const closingDate = new Date(formData.closing_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (closingDate < today) {
        newErrors.closing_date = "Closing date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      title: true,
      position: true,
      description: true,
      salary: true,
      closing_date: true,
    });

    if (!validateForm()) {
      return;
    }

    // Build request matching backend CreateJobPostingRequest
    const requestData: CreateJobRequest = {
      title: formData.title.trim(),
      position: formData.position.trim(),
      description: formData.description.trim(),
      responsibilities: formData.responsibilities.length > 0 ? formData.responsibilities : undefined,
      requirements: formData.requirements.length > 0 ? formData.requirements : undefined,
      nice_to_have: formData.nice_to_have.length > 0 ? formData.nice_to_have : undefined,
      employment_type: formData.employment_type,
      location_type: formData.location_type,
      show_salary: formData.show_salary,
      salary_min: formData.show_salary && formData.salary_min > 0 ? formData.salary_min : undefined,
      salary_max: formData.show_salary && formData.salary_max > 0 ? formData.salary_max : undefined,
      closing_date: formData.closing_date
        ? new Date(formData.closing_date).toISOString()
        : undefined,
    };
    onSave(requestData);
  };

  // Re-validate when relevant fields change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData.title, formData.position, formData.description, formData.salary_min, formData.salary_max, formData.show_salary, formData.closing_date]);

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </p>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{job ? "Edit Job Posting" : "Create Job Posting"}</SheetTitle>
          <SheetDescription>
            {job
              ? "Update the job posting details."
              : "Create a new job posting for your careers page."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Basketball Coach, Front Desk Associate"
                value={formData.title}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, title: e.target.value }))
                }
                onBlur={() => handleBlur("title")}
                className={touched.title && errors.title ? "border-destructive" : ""}
              />
              {touched.title && <ErrorMessage message={errors.title} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position/Department *</Label>
              <Input
                id="position"
                placeholder="e.g. Coaching, Front Desk, Facilities, Training"
                value={formData.position}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, position: e.target.value }))
                }
                onBlur={() => handleBlur("position")}
                className={touched.position && errors.position ? "border-destructive" : ""}
              />
              {touched.position && <ErrorMessage message={errors.position} />}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employment Type *</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      employment_type: v as EmploymentType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location Type *</Label>
                <Select
                  value={formData.location_type}
                  onValueChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      location_type: v as LocationType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_site">On-site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Job Description
            </h3>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role and what the candidate will be doing at the facility..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                onBlur={() => handleBlur("description")}
                rows={4}
                className={touched.description && errors.description ? "border-destructive" : ""}
              />
              {touched.description && <ErrorMessage message={errors.description} />}
            </div>

            <ListInput
              label="Responsibilities"
              placeholder="Lead youth basketball training sessions"
              examples={[
                "Develop practice plans and drills",
                "Communicate with parents about player progress",
                "Maintain equipment and court cleanliness",
              ]}
              items={formData.responsibilities}
              onChange={(items) => setFormData((f) => ({ ...f, responsibilities: items }))}
            />

            <ListInput
              label="Requirements"
              placeholder="2+ years coaching experience"
              examples={[
                "CPR and First Aid certification",
                "Background check clearance",
                "Strong communication skills",
              ]}
              items={formData.requirements}
              onChange={(items) => setFormData((f) => ({ ...f, requirements: items }))}
            />

            <ListInput
              label="Nice to Have"
              placeholder="College playing experience"
              examples={[
                "USA Basketball coaching license",
                "Bilingual (English/Spanish)",
              ]}
              items={formData.nice_to_have}
              onChange={(items) => setFormData((f) => ({ ...f, nice_to_have: items }))}
            />
          </div>

          {/* Compensation Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Compensation
            </h3>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Show Salary Range</Label>
                <p className="text-xs text-muted-foreground">
                  Display salary information on the job posting
                </p>
              </div>
              <Switch
                checked={formData.show_salary}
                onCheckedChange={(checked) =>
                  setFormData((f) => ({ ...f, show_salary: checked }))
                }
              />
            </div>

            {formData.show_salary && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary_min">Minimum Salary</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="salary_min"
                        type="number"
                        min={0}
                        placeholder="35000"
                        value={formData.salary_min || ""}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            salary_min: parseInt(e.target.value) || 0,
                          }))
                        }
                        onBlur={() => handleBlur("salary")}
                        className={`pl-7 ${touched.salary && errors.salary ? "border-destructive" : ""}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary_max">Maximum Salary</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="salary_max"
                        type="number"
                        min={0}
                        placeholder="55000"
                        value={formData.salary_max || ""}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            salary_max: parseInt(e.target.value) || 0,
                          }))
                        }
                        onBlur={() => handleBlur("salary")}
                        className={`pl-7 ${touched.salary && errors.salary ? "border-destructive" : ""}`}
                      />
                    </div>
                  </div>
                </div>
                {touched.salary && <ErrorMessage message={errors.salary} />}
              </>
            )}
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Settings
            </h3>

            <div className="space-y-2">
              <Label htmlFor="closing_date">Closing Date</Label>
              <Input
                id="closing_date"
                type="date"
                value={formData.closing_date}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, closing_date: e.target.value }))
                }
                onBlur={() => handleBlur("closing_date")}
                className={touched.closing_date && errors.closing_date ? "border-destructive" : ""}
              />
              {touched.closing_date && <ErrorMessage message={errors.closing_date} />}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {job ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
