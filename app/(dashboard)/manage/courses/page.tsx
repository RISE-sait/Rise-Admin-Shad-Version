import CoursesPage from "@/components/courses/CoursePage";
import { Course } from "@/types/course";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const courseName = (await searchParams).name

  const data = await fetch(process.env.BACKEND_URL +`/api/courses?name=${courseName ?? ''}`)
  const courses: Course[] = await data.json()

  return (
    <div className="p-6 flex">
      <CoursesPage courses={courses} />
    </div>
  )
}
