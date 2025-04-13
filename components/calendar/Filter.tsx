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
import { ApiService } from "@/app/api/ApiService"
import { useUser } from "@/contexts/UserContext"
import { getAllPrograms } from "@/services/program"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterComponentProps {
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType, value: any) => void;
  resetFilters: () => void;
}

// Define a program interface
interface Program {
  id: string;
  name: string;
  type: string;
}

export default function FilterComponent({
  filters,
  onFilterChange,
  resetFilters,
}: FilterComponentProps) {
  // State for dynamic data
  const { user } = useUser()
  const [locations, setLocations] = useState<Location[]>([]);
  const [trainers, setTrainers] = useState<{id: string; name: string}[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState({
    locations: false,
    trainers: false,
    programs: false,
  });

  // Program types
  const programTypes = ["game", "practice", "course", "others"];

  // Parse dates for the calendar components
  const afterDate = filters.after ? new Date(filters.after) : undefined;
  const beforeDate = filters.before ? new Date(filters.before) : undefined;

  // Fetch locations using ApiService instead of direct service call
  useEffect(() => {
    async function fetchLocations() {
      setIsLoading(prev => ({ ...prev, locations: true }));
      try {
        // Try using ApiService first 
        try {
          console.log("Fetching locations via ApiService");
          const response = await ApiService.locations.locationsList();
          
          if (response && response.data) {
            console.log(`ApiService: ${response.data.length} locations loaded`);
            
            // Add proper typing and null checks
            const mappedLocations: Location[] = response.data.map((loc): Location => ({
              id: loc.id || '', // Use empty string as fallback
              name: loc.name || '', // Use empty string as fallback
              Address: loc.address || '' // Map from 'address' to 'Address'
            }));
            
            setLocations(mappedLocations);
            return; // Success, return early
          }
        } catch (apiError) {
          console.log("ApiService failed, trying direct service call", apiError);
        }
        
        // Fallback to direct service call if ApiService failed
        try {
          const locationsData = await fetch('/api/locations', {
            method: 'GET',
            headers: {
              'Authorization': user?.Jwt ? `Bearer ${user.Jwt}` : '',
              'Content-Type': 'application/json'
            }
          });
          
          if (locationsData.ok) {
            const data = await locationsData.json();
            console.log(`Direct fetch: ${data.length} locations loaded`);
            
            // Add proper typing and null checks
            const mappedLocations: Location[] = data.map((loc: any): Location => ({
              id: loc.id || '', // Use empty string as fallback
              name: loc.name || '', // Use empty string as fallback
              Address: loc.address || '' // Map from 'address' to 'Address'
            }));
            
            setLocations(mappedLocations);
          } else {
            throw new Error(`Failed with status: ${locationsData.status}`);
          }
        } catch (fetchError) {
          console.error("Direct fetch failed:", fetchError);
          // Use mock data as last resort
          setLocations([
            { id: "1", name: "Main Facility", Address: "123 Main St" },
            { id: "2", name: "Downtown Location", Address: "456 Market St" },
          ]);
          console.log("Using mock location data as fallback");
        }
      } catch (error) {
        console.error("Error in location fetch flow:", error);
        setLocations([]);
      } finally {
        setIsLoading(prev => ({ ...prev, locations: false }));
      }
    }
    
    fetchLocations();
  }, [user?.Jwt]);

  // Fetch trainers with improved error handling
  useEffect(() => {
    async function fetchTrainers() {
      setIsLoading(prev => ({ ...prev, trainers: true }));
      try {
        console.log("Starting trainer fetch, JWT present:", !!user?.Jwt);
        
        // Use ApiService with better error handling
        const response = await ApiService.staffs.staffsList();
        
        if (!response || !response.data) {
          console.warn("No staff data in response or invalid response format");
          // Use mock data as fallback
          setTrainers([
            { id: "t1", name: "John Smith" },
            { id: "t2", name: "Sarah Chen" },
          ]);
          return;
        }
        
        // Filter for staff with trainer/coach role
        const trainersData = response.data.filter(staff => 
          staff.role_name?.toLowerCase()?.includes('trainer') ||
          staff.role_name?.toLowerCase()?.includes('coach')
        );
        
        // Format the data for the dropdown
        const formattedTrainers = trainersData.map(staff => ({
          id: staff.id || '',
          name: `${staff.first_name || ''} ${staff.last_name || ''}`
        }));
        
        console.log(`Trainers fetched: ${formattedTrainers.length}`);
        setTrainers(formattedTrainers);
      } catch (error) {
        console.error("Error fetching trainers:", error);
        // Provide fallback data
        setTrainers([
          { id: "t1", name: "John Smith" },
          { id: "t2", name: "Sarah Chen" },
        ]);
      } finally {
        setIsLoading(prev => ({ ...prev, trainers: false }));
      }
    }
    
    fetchTrainers();
  }, [user?.Jwt]);

  // Simplified program fetching using getAllPrograms function
  useEffect(() => {
    async function fetchPrograms() {
      setIsLoading(prev => ({ ...prev, programs: true }));
      try {
        console.log("Fetching all programs");
        
        // Get all programs in a single request using the service function
        const allProgramsData = await getAllPrograms();
        
        if (allProgramsData && allProgramsData.length > 0) {
          console.log(`Programs loaded: ${allProgramsData.length}`);
          
          // Map the response to the Program interface
          const formattedPrograms: Program[] = allProgramsData.map((program: any): Program => ({
            id: program.id || '',
            name: program.name || '',
            type: program.type?.toLowerCase() || 'others' // normalize type to lowercase
          }));
          
          // Set all programs
          setPrograms(formattedPrograms);
        } else {
          // If no programs were returned, use fallback mock data
          console.log("No programs returned from API, using mock data");
          setPrograms([
            { id: "p1", name: "Basketball Training", type: "practice" },
            { id: "p2", name: "Soccer Match", type: "game" },
            { id: "p3", name: "Tennis Fundamentals", type: "course" },
            { id: "p4", name: "Swimming Practice", type: "practice" },
            { id: "p5", name: "Baseball Game", type: "game" },
            { id: "p6", name: "Yoga Class", type: "course" },
            { id: "p7", name: "Fitness Assessment", type: "others" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        // Fallback to mock data on error
        setPrograms([
          { id: "p1", name: "Basketball Training", type: "practice" },
          { id: "p2", name: "Soccer Match", type: "game" },
          { id: "p3", name: "Tennis Fundamentals", type: "course" },
          { id: "p4", name: "Swimming Practice", type: "practice" },
          { id: "p5", name: "Baseball Game", type: "game" },
          { id: "p6", name: "Yoga Class", type: "course" },
          { id: "p7", name: "Fitness Assessment", type: "others" }
        ]);
      } finally {
        setIsLoading(prev => ({ ...prev, programs: false }));
      }
    }
    
    fetchPrograms();
  }, [user?.Jwt]);

  // Filter programs based on selected program type
  useEffect(() => {
    if (!filters.program_type) {
      // When "All Types" is selected, show ALL programs
      setFilteredPrograms(programs);
      return;
    }
    
    const filtered = programs.filter(program => 
      program.type.toLowerCase() === filters.program_type?.toLowerCase()
    );
    
    console.log(`Filtered ${filtered.length} programs of type ${filters.program_type}`);
    setFilteredPrograms(filtered);
    
    // Clear program IDs when type changes
    if (filters.program_ids?.length) {
      onFilterChange("program_ids", []);
    }
  }, [filters.program_type, programs]);

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
              {filters.program_type && filteredPrograms.length > 0 && (
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
                      {filteredPrograms.map(program => (
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
                  {trainers.map(trainer => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Appointments Status */}
        <AccordionItem value="appointments">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Appointment Status
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.appointments}
              onValueChange={(val) => onFilterChange("appointments", val)}
              className="flex flex-col space-y-2 pl-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="booked" id="appt-booked" />
                <Label htmlFor="appt-booked">Booked Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-booked" id="appt-nonbooked" />
                <Label htmlFor="appt-nonbooked">Non-Booked Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="appt-both" />
                <Label htmlFor="appt-both">Show Both</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}