"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import getValue from "../Singleton";
import { Schedule } from "@/types/course";

export default function AddCourseForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const apiUrl = getValue("API");

  const courseData = {
    name,
    description,
    schedules
  };

  const handleAddCourse = async () => {
    // Check if the course name is empty
    if (!name.trim()) {
      toast.error("Course name is required.");
      return;
    }

    try {
      const response = await fetch(apiUrl + `/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update course:", errorText);
        toast.error("Failed to save course. Please try again.");
        return;
      }

      toast.success("Successfully Saved");
    } catch (error) {
      console.error("Error during API request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="pb-4">
        <p className="pb-2">
          Course Name <span className="text-red-500">*</span>
        </p>
        <Input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
        />
      </div>

      <div className="pb-4">
        <p className="pb-2">Description</p>
        <Textarea
          rows={Math.max(4, description.split("\n").length)}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>

      <Button onClick={handleAddCourse}>Add Course</Button>
    </div>
  );
}
