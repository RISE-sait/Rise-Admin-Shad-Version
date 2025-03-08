"use client";
import { Course } from "../../types/course";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CourseTable({
  courses,
  onCourseSelect,
}: {
  courses: Course[];
  onCourseSelect: (course: Course) => void;
}) {
  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow key="no-courses">
              <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                No courses found
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow
                key={course.id}
                onClick={() => onCourseSelect(course)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{course.name}</TableCell>
                <TableCell>
                  {course.description
                    ? course.description.length > 50
                      ? `${course.description.substring(0, 50)}...`
                      : course.description
                    : ""}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
