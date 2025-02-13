"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FiltersType } from "../../types/calendar"
import { Settings } from "lucide-react"

interface FilterComponentProps {
  filters: FiltersType
  onFilterChange: (type: keyof FiltersType | "settingsTimeFormat" | "settingsWeekStart", value: string, isChecked: boolean) => void
  toggleSelectAllFacilities: (checked: boolean) => void
  resetFilters: () => void
}

export default function FilterComponent({
  filters,
  onFilterChange,
  toggleSelectAllFacilities,
  resetFilters,
}: FilterComponentProps) {
  // An easy way to determine if all (IDs 4–8) are checked
  const allFacilitiesChecked = filters.facilities
    .slice(3)
    .every((facility) => facility.checked)

  return (
    <div className="p-4 bg-white dark:bg-black dark:border-gray-900 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {/* Trainers (Checkboxes) */}
        <AccordionItem value="trainers">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100" >
            Trainers
          </AccordionTrigger>
          <AccordionContent>
            {filters.trainers.map((trainer) => (
              <div key={trainer.id} className="flex items-center gap-2 pl-2 mb-2">
                <Checkbox
                  id={`trainer-${trainer.id}`}
                  checked={trainer.checked}
                  onCheckedChange={(checked) => onFilterChange("trainers", trainer.name, !!checked)}
                />
                <Label htmlFor={`trainer-${trainer.id}`} className="text-gray-900 dark:text-gray-100">
                  {trainer.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Classes (Checkboxes) */}
        <AccordionItem value="classes">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Classes
          </AccordionTrigger>
          <AccordionContent>
            {filters.classes.map((cls) => (
              <div key={cls.id} className="flex items-center gap-2 pl-2 mb-2">
                <Checkbox
                  id={`class-${cls.id}`}
                  checked={cls.checked}
                  onCheckedChange={(checked) => onFilterChange("classes", cls.name, !!checked)}
                />
                <Label htmlFor={`class-${cls.id}`} className="text-gray-900 dark:text-gray-100">
                  {cls.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Appointments (Radio Group) */}
        <AccordionItem value="appointments">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Appointments
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.appointments}
              onValueChange={(val) => onFilterChange("appointments", val, true)}
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

        {/* Facilities */}
        <AccordionItem value="facilities">
          <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
            Facilities
          </AccordionTrigger>
          <AccordionContent>
            {/* Radio group for IDs 1,2,3 */}
            <RadioGroup
              onValueChange={(val) => onFilterChange("facilities", val, true)}
              value={filters.facilities.slice(0, 3).find((f) => f.checked)?.name ?? ""}
              className="flex flex-col space-y-2 pl-2 mb-4"
            >
              {filters.facilities.slice(0, 3).map((facility) => (
                <div key={facility.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={facility.name} id={`facility-radio-${facility.id}`} />
                  <Label htmlFor={`facility-radio-${facility.id}`}>{facility.name}</Label>
                </div>
              ))}
            </RadioGroup>
            <Separator className="mb-4" />

            {/* Single checkbox to select/deselect IDs 4–8 */}
            <div className="flex items-center gap-2 pl-2 mb-3">
              <Checkbox
                id="facilities-select-all"
                checked={allFacilitiesChecked}
                onCheckedChange={(checked) => toggleSelectAllFacilities(!!checked)}
              />
              <Label htmlFor="facilities-select-all">Select All</Label>
            </div>

            {/* Checkboxes for IDs 4–8 */}
            <div className="grid grid-cols-1 gap-2 pl-2">
              {filters.facilities.slice(3).map((facility) => (
                <div key={facility.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`facility-${facility.id}`}
                    checked={facility.checked}
                    onCheckedChange={(checked) => onFilterChange("facilities", facility.name, !!checked)}
                  />
                  <Label htmlFor={`facility-${facility.id}`}>{facility.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="settings">
        <AccordionTrigger className="text-large font-medium text-gray-900 dark:text-gray-100">
          
          Settings
        </AccordionTrigger>
        <AccordionContent>
          {/* Time Format */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Time display format</h3>
            <RadioGroup onValueChange={(val) => onFilterChange("settingsTimeFormat", val, true)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12hr" id="time-12" />
                <Label htmlFor="time-12">12 hour (am/pm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24hr" id="time-24" />
                <Label htmlFor="time-24">24 hour</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Week starts on */}
          <div>
            <h3 className="font-semibold mb-1">Week starts on</h3>
            <RadioGroup onValueChange={(val) => onFilterChange("settingsWeekStart", val, true)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monday" id="week-monday" />
                <Label htmlFor="week-monday">Monday</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sunday" id="week-sunday" />
                <Label htmlFor="week-sunday">Sunday</Label>
              </div>
            </RadioGroup>
          </div>
        </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}