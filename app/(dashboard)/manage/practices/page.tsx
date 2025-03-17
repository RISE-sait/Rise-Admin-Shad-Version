import PracticePage from "@/components/practices/PracticePage";
import { Practice } from "@/types/practice";
import getValue from "@/configs/constants";
import { DtoPracticeResponse } from "@/app/api/Api";

export default async function Page() {
  // Get API URL
  const apiUrl = getValue("API");

  const response = await fetch(apiUrl + `practices`);
  const practicesResponse: DtoPracticeResponse[] = await response.json();

  const practices: Practice[] = practicesResponse.map((practice) => ({
    id: practice.id!,
    name: practice.name!,
    description: practice.description!,
    createdAt: new Date(practice.createdAt as string),
    updatedAt: new Date(practice.updatedAt as string),
  }))

  return (
    <div className="p-6 flex">
      <PracticePage practices={practices} />
    </div>
  );
}
