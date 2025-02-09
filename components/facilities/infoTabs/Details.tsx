import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useFormData } from "@/hooks/form-data";
import { Facility, FacilityType } from "@/types/facility";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast"

export default function DetailsTab({ facility }: { facility: Facility }) {

  const { toast } = useToast()

  const { data, updateField, isChanged, resetData } = useFormData({
    name: facility.name,
    location: facility.location,
    type: facility.facility_type,
  });

  const [nameInputEnabled, setNameInputEnabled] = useState(false)
  const [locationInputEnabled, setLocationInputEnabled] = useState(false)

  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);

  useEffect(() => {

    (async () => {
      const facilityTypes = await fetch("/api/facilities/types", {
        credentials: "include",
      })
      if (!facilityTypes.ok) {
        console.error("Failed to fetch facility types")
        console.error(await facilityTypes.text())
        return
      }
      const data = await facilityTypes.json()

      setFacilityTypes(data)
    }
    )()
  }, [facility.id])

  const updateFacility = async () => {
    const response = await fetch("/api/facilities/" + facility.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        location: data.location,
        facility_type_id: facilityTypes.find((type) => type.name === data.type)?.id,
      }),
    })

    if (!response.ok) {
      console.error("Failed to update facility")
      console.error(await response.text())
      return
    }

    toast({
      status: "success",
      description: "Successfully saved.",
    })
  }

  return (
    <div className="p-4 space-y-4">

      <div className="space-y-5">
        <div>
          <div>
            <p className="text-base font-semibold ">
              Name <span className="text-red-500">*</span>

            </p>
            <p className="font-normal text-sm flex items-center">
              <Input onChange={e => updateField("name", e.target.value)}
                disabled={!nameInputEnabled} type="text"
                value={data.name} />
              <FaRegEdit onClick={() => setNameInputEnabled(!nameInputEnabled)} className="cursor-pointer ml-2 size-4" />
            </p>

          </div>
        </div>


        <div>
          <p className="text-base font-semibold ">
            Location <span className="text-red-500">*</span>
          </p>
          <p className="font-normal text-sm flex items-center">
            <Input
              onChange={(e) => updateField("location", e.target.value)}
              disabled={!locationInputEnabled}
              type="text"
              value={data.location}
            />
            <FaRegEdit
              onClick={() => setLocationInputEnabled(!locationInputEnabled)}
              className="cursor-pointer ml-2 size-4"
            />
          </p>
        </div>

        <div>
          <p className="text-base font-semibold ">
            Type <span className="text-red-500">*</span>

          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>{data.type}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                facilityTypes.map((facilityType) => (
                  <DropdownMenuItem key={facilityType.id} onSelect={() => updateField("type", facilityType.name)}
                  >
                    {facilityType.name}
                  </DropdownMenuItem>
                ))
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <section className="flex justify-between">
        <Button onClick={updateFacility} disabled={!isChanged
        } className="bg-green-500 text-black font-semibold">Save</Button>
        <Button onClick={resetData} className="text-black font-semibold">Reset changes</Button>
      </section>
    </div>
  )
}