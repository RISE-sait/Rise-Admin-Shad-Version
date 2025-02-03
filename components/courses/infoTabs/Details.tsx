// Removed MUI imports (Card, CardContent, Typography, Grid, Box, Divider)
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useFormData } from "@/hooks/form-data";
import { useToast } from "@/hooks/use-toast";
import { cn, convertDateToUTC } from "@/lib/utils";
import { Course } from "@/types/course"
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

export default function DetailsTab({ course }: { course: Course }) {

  const { toast } = useToast()

  const { data, updateField, isChanged, resetData } = useFormData({
    name: course.name,
    startDate: course.start_date ? parseISO(course.start_date) : null,
    endDate: course.end_date ? parseISO(course.end_date) : null,
    description: course.description
  });

  const [nameInputEnabled, setNameInputEnabled] = useState(false)
  const [startDateInputEnabled, setStartDateInputEnabled] = useState(false)
  const [endDateInputEnabled, setEndDateInputEnabled] = useState(false)
  const [descriptionInputEnabled, setDescriptionInputEnabled] = useState(false)

  const updateCourse = async () => {
    
    const response = await fetch("http://localhost:8080/api/courses/" + course.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        start_date: convertDateToUTC(data.startDate as Date),
        end_date: convertDateToUTC(data.endDate as Date)
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
    <div className="p-4 space-y-4">

      <div className="space-y-5">
        <div>
          <div>
            <p className="text-base font-semibold ">
              Course Name

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
          <p className="text-base font-semibold">Start Date</p>
          <p className="font-normal text-sm flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={!startDateInputEnabled}
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !data.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.startDate ? format(data.startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.startDate ?? undefined}
                  onSelect={(date) => updateField("startDate", date ?? null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FaRegEdit onClick={() => setStartDateInputEnabled(!startDateInputEnabled)} className="cursor-pointer ml-2 size-4" />
          </p>
        </div>

        <div>
          <p className="text-base font-semibold">End Date</p>
          <p className="font-normal text-sm flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={!endDateInputEnabled}
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !data.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.endDate ? format(data.endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.endDate ?? undefined}
                  onSelect={(date) => updateField("endDate", date ?? null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FaRegEdit onClick={() => setEndDateInputEnabled(!endDateInputEnabled)} className="cursor-pointer ml-2 size-4" />
          </p>
        </div>

        <div>
          <p className="text-base font-semibold ">
            Description
          </p>
          <p className="font-normal text-sm flex items-center">
            <Textarea
              rows={Math.max(4, course.description.split("\n").length)}
              onChange={e => updateField("description", e.target.value)}
              disabled={!descriptionInputEnabled}
              value={data.description} />
            <FaRegEdit onClick={() => setDescriptionInputEnabled(!descriptionInputEnabled)} className="cursor-pointer ml-2 size-4" />
          </p>
        </div>
      </div>

      <section className="flex justify-between">
        <Button onClick={updateCourse} disabled={!isChanged
        } className="bg-green-500 text-black font-semibold">Save</Button>
        <Button onClick={resetData} className="text-black font-semibold">Reset changes</Button>
      </section>
    </div>
  )
}