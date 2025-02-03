"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "../ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn, convertDateToUTC } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { Textarea } from "../ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function AddCourseForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleAddCourse = async () => {
    const response = await fetch("http://localhost:8080/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        start_date: convertDateToUTC(startDate as Date),
        end_date: convertDateToUTC(endDate as Date)
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
    setDescription("")
    setStartDate(null)
    setEndDate(null)
  }

  return (
    <div className="p-6 space-y-4">
      <p className="text-2xl font-semibold">Add Course</p>
      <Separator />
      <div className="space-y-5">
        <div>
          <div>
            <p className="text-base font-semibold ">
              Course Name <span className="text-red-500">*</span>

            </p>
            <p className="font-normal text-sm flex items-center">
              <Input onChange={e => setName(e.target.value)}
                type="text"
                value={name} />
            </p>

          </div>
        </div>


        <div>
          <p className="text-base font-semibold">
            Start Date <span className="text-red-500">*</span>
          </p>
          <p className="font-normal text-sm flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate ?? undefined}
                  onSelect={(date) => setStartDate(date ?? null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </p>
        </div>

        <div>
          <p className="text-base font-semibold">
            End Date <span className="text-red-500">*</span>
          </p>
          <p className="font-normal text-sm flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate ?? undefined}
                  onSelect={(date) => setEndDate(date ?? null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </p>
        </div>

        <div>
          <p className="text-base font-semibold ">
            Description
          </p>
          <p className="font-normal text-sm flex items-center">
            <Textarea
              rows={Math.max(4, description.split("\n").length)}
              onChange={e => setDescription(e.target.value)}
              value={description} />
          </p>
        </div>
      </div>

      <section className="flex justify-between">
        <Button
          onClick={handleAddCourse}
          disabled={
            !name || !startDate || !endDate
          } className="bg-green-500 text-black font-semibold">Save</Button>
        <Button onClick={resetData} className="text-black font-semibold">Reset</Button>
      </section>
    </div>
  )
}