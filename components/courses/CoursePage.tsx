"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Course } from "@/types/course";
import { Input } from "@/components/ui/input";
import CourseTable from "./CourseTable";
import CourseInfoPanel from "./CourseInfoPanel";
import AddCourseForm from "./AddCourseForm";

export default function CoursesPage({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<"details" | "add" | null>(
    null,
  );

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setDialogContent("details");
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-xl mb-4">Courses</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-between gap-2 mb-4 w-full">
            <Input
              type="search"
              id="coursesearch"
              placeholder="search courses"
            />
            <Button
              variant="outline"
              onClick={() => {
                setDialogContent("add");
                setDialogOpen(true);
              }}
            >
              Add Course
            </Button>
          </div>
        </div>
        <CourseTable courses={courses} onCourseSelect={handleCourseSelect} />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogContent === "details" ? "Course Details" : "Add Course"}
            </DialogTitle>
            <DialogDescription>
              {dialogContent === "details"
                ? "Manage & Update Course Information"
                : "Create a Brand New Course"}
            </DialogDescription>
          </DialogHeader>
          {dialogContent === "details" && selectedCourse && (
            <CourseInfoPanel course={selectedCourse} />
          )}
          {dialogContent === "add" && <AddCourseForm />}
        </DialogContent>
      </Dialog>
    </>
  );
}
