import PracticePage from "@/components/practices/PracticePage";
import { getAllPractices } from "@/services/practices";

export default async function Page() {
  const practices = await getAllPractices()

  return (
    <div className="p-6 flex">
      <PracticePage practices={practices} />
    </div>
  );
}
