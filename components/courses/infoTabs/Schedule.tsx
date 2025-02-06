import { useEffect, useState } from "react";
import { Schedule } from "@/types/schedule";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";
import { Facility } from "@/types/facility";

export default function SchedulesTab({ courseId }: { courseId: string }) {

  const [schedules, setSchedules] = useState<Schedule[]>([])

  useEffect(() => {
    // Fetch the schedules based on the courseId
    (async () => {
      const response = await fetch("http://localhost:8080/api/schedules?course_id=" + courseId)

      if (!response.ok) {
        console.error("Failed to fetch schedules")
        console.error(await response.text())
        return
      }

      const schedules = await response.json()

      setSchedules(schedules)
    })()
  }, [courseId])

  return (
    <div className="p-4 space-y-4">
      {
        schedules.map((schedule) => (
          <ScheduleListCard key={schedule.id} schedule={schedule} courseId={courseId} />
        ))
      }
    </div>
  )
}

// I dont know why refactoring this to a separate file doesn't work, the dropdown doesn't render well

function ScheduleListCard({ schedule, courseId }: { schedule: Schedule, courseId: string }) {

  const [beginTimeStr, setBeginTimeStr] = useState(schedule.begin_time)
  const [endTimeStr, setEndTimeStr] = useState(schedule.end_time)
  const [day, setDay] = useState(schedule.day)
  const [facility, setFacility] = useState(schedule.facility)

  const [facilties, setFacilities] = useState<Facility[]>([])

  const resetChanges = () => {
    setBeginTimeStr(schedule.begin_time)
    setEndTimeStr(schedule.end_time)
    setDay(schedule.day)
    setFacility(schedule.facility)
  }

  const isFormChanged = () => {

    return !(beginTimeStr === schedule.begin_time &&
      endTimeStr === schedule.end_time &&
      day === schedule.day &&
      facility === schedule.facility
    )
  }

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8080/api/facilities")

      if (!response.ok) {
        console.error("Failed to fetch facilities")
        console.error(await response.text())
        return
      }

      const facilities = await response.json()

      setFacilities(facilities)
    })()
  }, [])

  const updateSchedule = async () => {

    if (!day) {
      toast({
        status: "error",
        description: "Please select a day.",
      })
      return
    }

    const facilityId = facilties.find(f => {
      if (f.name === facility) {
        console.log(f.name)
        return f
      }
    })?.id

    const response = await fetch("http://localhost:8080/api/schedules/" + schedule.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        begin_time: beginTimeStr + ":00",
        end_time: endTimeStr + ":00",
        day: day,
        course_id: courseId,
        facility_id: facilityId
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

  return (
    <div className="py-4 space-y-4">

      <div className="flex justify-between">
        <div>
          <p className="text-base font-semibold ">
            Begin Time <span className="text-red-500">*</span>
          </p>
          <Input onChange={e => { setBeginTimeStr(e.target.value) }}
            type="time"
            value={beginTimeStr}
          />
        </div>

        <div>
          <p className="text-base font-semibold ">
            End Time <span className="text-red-500">*</span>
          </p>
          <Input onChange={e => { setEndTimeStr(e.target.value) }}
            type="time"
            value={endTimeStr}
          />
        </div>

      </div >

      <div className="flex justify-between">
        <div>
          <p className="text-base font-semibold ">
            Day <span className="text-red-500">*</span>
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>{day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                  .map((day) => (
                    <DropdownMenuItem
                      key={day}
                      onSelect={() => { setDay(day.toUpperCase()) }}
                    >
                      {day}
                    </DropdownMenuItem>
                  ))
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>

          <p className="text-base font-semibold ">
            Facility <span className="text-red-500">*</span>
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>{facility}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                facilties.map((facility) => (
                  <DropdownMenuItem key={facility.id} onSelect={() => { setFacility(facility.name) }}
                  >
                    {facility.name}
                  </DropdownMenuItem>
                ))
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>

      <section className="flex justify-center mt-6 gap-4">
        <Button
          disabled={!isFormChanged()}
          onClick={updateSchedule}
          className="bg-green-500 text-black font-semibold">Save</Button>
        <Button onClick={resetChanges}
          disabled={!isFormChanged()
          }
          className="text-black font-semibold">Reset changes</Button>
      </section>
    </div >
  )
}