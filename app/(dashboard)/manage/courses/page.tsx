import CoursesPage from "@/components/courses/CoursePage";
import { Course } from "@/types/course";
import getValue from "@/components/Singleton";

export default async function Page() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `/courses`);
  const courses: Course[] = await response.json();

  return (
    <div className="p-6 flex">
      <CoursesPage courses={courses} />
    </div>
  );
}
