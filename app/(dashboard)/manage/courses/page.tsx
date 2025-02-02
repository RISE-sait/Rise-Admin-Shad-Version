import CoursesPage from "@/components/courses/CoursePage";
import { Course } from "@/types/course";

export default async function () {

  const data = await fetch('http://localhost:8080/api/courses')
  const courses: Course[] = await data.json()

  return <CoursesPage courses={courses} />
}
