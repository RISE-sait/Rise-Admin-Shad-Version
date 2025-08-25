"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Location } from "@/types/location";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllPrograms } from "@/services/program";
import { getAllLocations } from "@/services/location";

import { toast } from "@/hooks/use-toast";
import { Program } from "@/types/program";
import { useRouterQuery } from "@/hooks/router-query";
import { SheetClose } from "../ui/sheet";

export default function FilterComponent() {
  // State for dynamic data
  const [locations, setLocations] = useState<Location[]>([]);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState({
    locations: false,

    programs: false,
  });

  const { val, replace, reset } = useRouterQuery({
    program_id: "",

    location_id: "",
    program_type: "",
    after: "",
    before: "",
  });

  const programTypes = programs.reduce((acc: string[], program) => {
    if (!acc.includes(program.type)) acc.push(program.type);
    return acc;
  }, []);

  // Parse dates for the calendar components
  const afterDate = val.after ? parseISO(val.after) : undefined;
  const beforeDate = val.before ? parseISO(val.before) : undefined;

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading({ locations: true, programs: true });

      try {
        const [locationsRes, programsRes] = await Promise.all([
          getAllLocations().catch(handleError("locations")),

          getAllPrograms().catch(handleError("programs")),
        ]);

        setLocations(locationsRes || []);

        setPrograms(programsRes || []);
      } finally {
        setIsLoading({ locations: false, programs: false });
      }
    };

    const handleError = (type: string) => (error: unknown) => {
      toast({
        status: "error",
        description:
          error instanceof Error ? error.message : `Failed to fetch ${type}`,
      });
      return undefined;
    };

    fetchAllData();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-black dark:border-gray-900 rounded-lg shadow space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filters
        </h2>
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
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {afterDate
                        ? format(afterDate, "PPP")
                        : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={afterDate}
                      onSelect={(date) =>
                        replace({
                          after: date ? format(date, "yyyy-MM-dd") : "",
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date (Before)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {beforeDate
                        ? format(beforeDate, "PPP")
                        : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={beforeDate}
                      onSelect={(date) =>
                        replace({
                          before: date ? format(date, "yyyy-MM-dd") : "",
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location Filter */}
        <AccordionItem value="location">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Location
          </AccordionTrigger>
          <AccordionContent>
            {isLoading.locations ? (
              <div>Loading locations...</div>
            ) : (
              <Select
                value={val.location_id || "all"}
                onValueChange={(value) =>
                  replace({
                    location_id: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
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
                value={val.program_type || ""}
                onValueChange={(value) =>
                  replace({
                    program_type: value,
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="all-types" />
                  <Label htmlFor="all-types">All Types</Label>
                </div>
                {programTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`type-${type}`} />
                    <Label htmlFor={`type-${type}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Program Names Dropdown */}
              {val.program_type && programs.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm mb-2 block">Select Program</Label>
                  <Select
                    value={val.program_id || "all"}
                    onValueChange={(value) =>
                      replace({
                        program_id: value === "all" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map((program) => (
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
      </Accordion>

      {/** Buttons Row at Bottom */}
      <div className="flex space-x-2 pt-4">
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
        <SheetClose asChild>
          <Button>Apply Filters</Button>
        </SheetClose>
      </div>
    </div>
  );
}
