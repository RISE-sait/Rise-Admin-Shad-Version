"use client"
// ...existing code...
// Removed MUI imports (DataGrid, etc.)
import { Course } from "../../types/course"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function CourseTable({
  courses,
  onCourseSelect,
}: {
  courses: Course []
  onCourseSelect: (id: string) => void
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
              onClick={() => onCourseSelect(course.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.start_date}</TableCell>
              <TableCell>{course.end_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}