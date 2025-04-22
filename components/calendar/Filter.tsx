"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { FiltersType } from "@/types/calendar"
import { Location } from "@/types/location"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllPrograms } from "@/services/program"
import { getAllLocations } from "@/services/location"
import { getAllStaffs } from "@/services/staff"
import { User } from "@/types/user"
import { toast } from "@/hooks/use-toast"
import { Program } from "@/types/program"

interface FilterComponentProps {
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType, value: any) => void;
  resetFilters: () => void;
}

export default function FilterComponent({
  filters,
  onFilterChange,
  resetFilters,
}: FilterComponentProps) {
  // State for dynamic data
  const [locations, setLocations] = useState<Location[]>([]);
  const [staffs, setStaffs] = useState<User[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState({
    locations: false,
    trainers: false,
    programs: false,
  })

  const programTypes = programs.reduce((acc: string[], program) => {
    if (!acc.includes(program.type)) acc.push(program.type)
    return acc
  }, [])

  // Parse dates for the calendar components
  const afterDate = filters.after ? new Date(filters.after) : undefined;
  const beforeDate = filters.before ? new Date(filters.before) : undefined;

  useEffect(() => {
    (async () => {
      // Set all loading states at once
      setIsLoading({ locations: true, trainers: true, programs: true });
      
      try {
        // Fetch all data in parallel
        const [locationsData, staffsData, programsData] = await Promise.all([
          getAllLocations().catch(error => {
            toast({
              status: "error",
              description: error instanceof Error ? error.message : "Failed to fetch locations",
            })
            return [];
          }),
          getAllStaffs().catch(error => {
            toast({
              status: "error",
              description: error instanceof Error ? error.message : "Failed to fetch trainers",
            });
            return [];
          }),
          getAllPrograms().catch(error => {
            toast({
              status: "error",
              description: error instanceof Error ? error.message : "Failed to fetch programs",
            });
            return [];
          })
        ]);
        
        setLocations(locationsData);
        setStaffs(staffsData);
        setPrograms(programsData);
      } catch (error) {

        console.error("Error fetching data:", error)

      } finally {

        setIsLoading({ locations: false, trainers: false, programs: false })

      }
    })()
  }, [])

  return (
    <div className="p-4 bg-white dark:bg-black dark:border-gray-900 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {/* Date Range Filters */}
        <AccordionItem value="dateRange">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Date Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date (After)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {afterDate ? format(afterDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={afterDate}
                      onSelect={(date) => onFilterChange("after", date ? format(date, "yyyy-MM-dd") : "")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date (Before)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {beforeDate ? format(beforeDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={beforeDate}
                      onSelect={(date) => onFilterChange("before", date ? format(date, "yyyy-MM-dd") : "")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location Filter - Changed from checkboxes to dropdown */}
        <AccordionItem value="location">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Location
          </AccordionTrigger>
          <AccordionContent>
            {isLoading.locations ? (
              <div>Loading locations...</div>
            ) : (
              <Select
                value={filters.location_id || "all"}
                onValueChange={(value) => onFilterChange("location_id", value === "all" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Program Type Filter */}
        <AccordionItem value="programType">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Program Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <RadioGroup
                value={filters.program_type || ""}
                onValueChange={(value) => onFilterChange("program_type", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="all-types" />
                  <Label htmlFor="all-types">All Types</Label>
                </div>
                {programTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`type-${type}`} />
                    <Label htmlFor={`type-${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Program Names - Changed from checkboxes to dropdown */}
              {filters.program_type && programs.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm mb-2 block">Select Program</Label>
                  <Select
                    value={filters.program_id || "all"}
                    onValueChange={(value) => onFilterChange("program_id", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Trainers - Changed from checkboxes to dropdown */}
        <AccordionItem value="trainers">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Trainers
          </AccordionTrigger>
          <AccordionContent>
            {isLoading.trainers ? (
              <div>Loading trainers...</div>
            ) : (
              <Select
                value={filters.user_id || "all"}
                onValueChange={(value) => onFilterChange("user_id", value === "all" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trainers</SelectItem>
                  {staffs.map(trainer => (
                    <SelectItem key={trainer.Email} value={trainer.Email!}>
                      {trainer.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}