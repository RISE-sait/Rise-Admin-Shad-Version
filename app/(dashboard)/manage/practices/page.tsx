import PracticePage from "@/components/practices/PracticePage";
import { getAllPracticeLevels, getAllPractices } from "@/services/practices";

export default async function Page() {
  const practices = await getAllPractices()

  const practiceLevels = await getAllPracticeLevels()

  return (
    <div className="p-6 flex">
      <PracticePage practices={practices} practiceLevels={practiceLevels}/>
    </div>
  )
}
