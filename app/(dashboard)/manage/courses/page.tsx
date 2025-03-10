import CoursesPage from "@/components/courses/CoursePage";
import { Course } from "@/types/course";
import getValue from "@/components/Singleton";
import { CourseResponseDto } from "@/app/api/Api";

export default async function Page() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `/courses`);
  const coursesResponse: CourseResponseDto[] = await response.json();

  const courses: Course[] = coursesResponse.map((course) => ({
    id: course.id!,
    name: course.name!,
    description: course.description!,
    createdAt: new Date(course.createdAt as string),
    updatedAt: new Date(course.updatedAt as string),
  }));

  return (
    <div className="p-6 flex">
      <CoursesPage courses={courses} />
    </div>
  );
}
