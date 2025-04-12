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
import { getAllPrograms } from "@/services/practices"
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

        {/* Location Filter - UPDATED to use checkboxes */}
        <AccordionItem value="location">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Location
          </AccordionTrigger>
          <AccordionContent>
            {isLoading.locations ? (
              <div>Loading locations...</div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-2">
                  <Checkbox 
                    id="all-locations" 
                    checked={!filters.location_ids?.length}
                    onCheckedChange={() => {
                      // When "All Locations" is checked, clear the location_ids array
                      onFilterChange("location_ids", []);
                    }}
                  />
                  <Label htmlFor="all-locations" className="text-sm">All Locations</Label>
                </div>
                <Separator className="my-2" />
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-2">
                    {locations.map(location => (
                      <div key={location.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`loc-${location.id}`}
                          checked={filters.location_ids?.includes(location.id)}
                          onCheckedChange={(checked) => {
                            const currentLocations = filters.location_ids || [];
                            if (checked) {
                              // Add location to the array if checked
                              onFilterChange("location_ids", [...currentLocations, location.id]);
                            } else {
                              // Remove location from the array if unchecked
                              onFilterChange("location_ids", currentLocations.filter(id => id !== location.id));
                            }
                          }}
                        />
                        <Label htmlFor={`loc-${location.id}`} className="text-sm">{location.name}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
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
              
              {/* Program Names - UPDATED to use checkboxes */}
              {filters.program_type && filteredPrograms.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm mb-2 block">Select Programs</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 pb-2">
                      <Checkbox 
                        id="all-programs" 
                        checked={!filters.program_ids?.length}
                        onCheckedChange={() => {
                          // When "All Programs" is checked, clear the program_ids array
                          onFilterChange("program_ids", []);
                        }}
                      />
                      <Label htmlFor="all-programs" className="text-sm">All Programs</Label>
                    </div>
                    <Separator className="my-2" />
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-2">
                        {filteredPrograms.map(program => (
                          <div key={program.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`program-${program.id}`}
                              checked={filters.program_ids?.includes(program.id)}
                              onCheckedChange={(checked) => {
                                const currentPrograms = filters.program_ids || [];
                                if (checked) {
                                  // Add program to the array if checked
                                  onFilterChange("program_ids", [...currentPrograms, program.id]);
                                } else {
                                  // Remove program from the array if unchecked
                                  onFilterChange("program_ids", currentPrograms.filter(id => id !== program.id));
                                }
                              }}
                            />
                            <Label htmlFor={`program-${program.id}`} className="text-sm">{program.name}</Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Trainers - UPDATED to use checkboxes */}
        <AccordionItem value="trainers">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Trainers
          </AccordionTrigger>
          <AccordionContent>
            {isLoading.trainers ? (
              <div>Loading trainers...</div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-2">
                  <Checkbox 
                    id="all-trainers" 
                    checked={!filters.user_ids?.length}
                    onCheckedChange={() => {
                      // When "All Trainers" is checked, clear the user_ids array
                      onFilterChange("user_ids", []);
                    }}
                  />
                  <Label htmlFor="all-trainers" className="text-sm">All Trainers</Label>
                </div>
                <Separator className="my-2" />
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-2">
                    {trainers.map(trainer => (
                      <div key={trainer.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`trainer-${trainer.id}`}
                          checked={filters.user_ids?.includes(trainer.id)}
                          onCheckedChange={(checked) => {
                            const currentTrainers = filters.user_ids || [];
                            if (checked) {
                              // Add trainer to the array if checked
                              onFilterChange("user_ids", [...currentTrainers, trainer.id]);
                            } else {
                              // Remove trainer from the array if unchecked
                              onFilterChange("user_ids", currentTrainers.filter(id => id !== trainer.id));
                            }
                          }}
                        />
                        <Label htmlFor={`trainer-${trainer.id}`} className="text-sm">{trainer.name}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
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