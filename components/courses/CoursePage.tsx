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
  const [searchQuery, setSearchQuery] = useState("");

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setDialogContent("details");
    setDialogOpen(true);
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description &&
        course.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto max-w-6xl">
        <h1 className="text-xl mb-4">Courses</h1>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Input
            type="search"
            id="coursesearch"
            placeholder="Search courses"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <CourseTable
          courses={filteredCourses}
          onCourseSelect={handleCourseSelect}
        />
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
