"use client"
// ...existing code...
// Removed MUI imports (DataGrid, etc.)
import { Course } from "../../types/course"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

export default function CourseTable({
  courses,
  onCourseSelect,
}: {
  courses: Course []
  onCourseSelect: (course: Course) => void
}) {
  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow
              key={course.id}
              onClick={() => onCourseSelect(course)}
            >
              <TableCell>{course.name}</TableCell>
              <TableCell>{format(new Date(course.start_date), "yyyy-MM-dd")}</TableCell>
              <TableCell>{format(new Date(course.end_date), "yyyy-MM-dd")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}