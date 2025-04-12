import PracticePage from "@/components/practices/PracticePage";
import { getAllProgramLevels, getAllPrograms } from "@/services/practices";

export default async function Page() {
  const practices = await getAllPrograms()

  const practiceLevels = await getAllProgramLevels()

  return (
    <div className="p-6 flex">
      <PracticePage practices={practices} practiceLevels={practiceLevels}/>
    </div>
  )
}
