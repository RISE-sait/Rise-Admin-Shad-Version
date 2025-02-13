"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "../ui/separator"
import { toast } from "@/hooks/use-toast"
import { FacilityType } from "@/types/facility"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export default function AddFacilityForm() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("")

  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);

  useEffect(() => {
  
      (async () => {
        const facilityTypes = await fetch("/api/facilities/types")
        if (!facilityTypes.ok) {
          console.error("Failed to fetch facility types")
          console.error(await facilityTypes.text())
          return
        }
        const data = await facilityTypes.json()
  
        setFacilityTypes(data)
      }
      )()
    }, [])

  const handleAddFacility = async () => {
    const response = await fetch("/api/facilities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        location,
        facility_type_id: facilityTypes.find((ft) => ft.name === type)?.id,
      }),
    })

    if (!response.ok) {
      console.error("Failed to update course")
      console.error(await response.text())
      return
    }

    toast({
      status: "success",
      description: "Successfully saved.",
    })
  }

  const resetData = () => {
    setName("")
    setLocation("")
    setType("")
  }

  return (
    <div className="p-6 space-y-4">
      <p className="text-2xl font-semibold">Add Facility</p>
      <Separator />
      <div className="space-y-5">
        <div>
          <div>
            <p className="text-base font-semibold ">
              Name <span className="text-red-500">*</span>

            </p>
            <p className="font-normal text-sm flex items-center">
              <Input onChange={e => setName(e.target.value)}
                type="text"
                value={name} />
            </p>

          </div>
        </div>


        <div>
          <div>
            <p className="text-base font-semibold ">
              Location <span className="text-red-500">*</span>

            </p>
            <p className="font-normal text-sm flex items-center">
              <Input onChange={e => setLocation(e.target.value)}
                type="text"
                value={location} />
            </p>

          </div>
        </div>

        <div>
          <p className="text-base font-semibold ">
            Type <span className="text-red-500">*</span>
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>{type === "" ? "Click to select a type" : type} </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                facilityTypes.map((facilityType) => (
                  <DropdownMenuItem key={facilityType.id} onSelect={() => setType(facilityType.name)}
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
        <Button
          onClick={handleAddFacility}
          disabled={
            !name || !location || !type
          } className="bg-green-500 text-black font-semibold">Save</Button>
        <Button onClick={resetData} className="text-black font-semibold">Reset</Button>
      </section>
    </div>
  )
}