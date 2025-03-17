"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Schedule, ScheduleDay } from "@/types/course";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusIcon, TrashIcon, ClockIcon, MapPinIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function ScheduleTab({
//   schedules,
//   onSchedulesChange
// }: {
//   schedules: Schedule[];
//   onSchedulesChange: (schedules: Schedule[]) => void;
}) {
  // const { toast } = useToast();

  // const handleAddSchedule = () => {
  //   onSchedulesChange([...schedules, {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     days: [],
  //     capacity: 100,
  //     name: "",
  //   }]);
  // };

  // const updateSchedule = (index: number, field: string, value: any) => {
  //   const updated = [...schedules];
  //   updated[index] = { ...updated[index], [field]: value };
  //   onSchedulesChange(updated);
  // };

  // const handleDayToggle = (scheduleIndex: number, day: string) => {
  //   const schedule = schedules[scheduleIndex];
  //   const dayExists = schedule.days.some(d => d.day === day);
    
  //   if (!dayExists) {
  //     updateSchedule(scheduleIndex, "days", [
  //       ...schedule.days,
  //       {
  //         day,
  //         startTime: "09:00",
  //         endTime: "17:00",
  //       }
  //     ]);
  //   } else {
  //     updateSchedule(scheduleIndex, "days", 
  //       schedule.days.filter(d => d.day !== day)
  //     );
  //   }
  // };

  // const updateDayField = (
  //   scheduleIndex: number,
  //   dayIndex: number,
  //   field: string,
  //   value: string
  // ) => {
  //   const updated = [...schedules];
  //   updated[scheduleIndex].days[dayIndex] = {
  //     ...updated[scheduleIndex].days[dayIndex],
  //     [field]: value
  //   };
  //   onSchedulesChange(updated);
  // };

  // return (
  //   <div className="space-y-6">

  //     {schedules.map((schedule, scheduleIndex) => (
  //       <div key={scheduleIndex} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
  //         <div className="flex justify-between items-start mb-6">
  //           <div className="space-y-1">
  //             <h3 className="text-lg font-semibold flex items-center gap-2">
  //               {schedule.name || "Unnamed Schedule"}
  //               <Badge variant="outline" className="text-sm font-normal">
  //                 Capacity: {schedule.capacity}
  //               </Badge>
  //             </h3>
  //             <div className="flex items-center gap-2 text-sm text-muted-foreground">
  //               <CalendarIcon className="h-4 w-4" />
  //               <span>
  //                 {format(schedule.startDate, "MMM dd")} - {format(schedule.endDate, "MMM dd, yyyy")}
  //               </span>
  //             </div>
  //           </div>
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             className="text-red-500 hover:text-red-600"
  //             onClick={() => onSchedulesChange(schedules.filter((_, i) => i !== scheduleIndex))}
  //           >
  //             <TrashIcon className="h-4 w-4 mr-2" />
  //             Delete
  //           </Button>
  //         </div>

  //         <div className="space-y-6">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <div className="space-y-2">
  //               <label className="text-sm font-medium">Schedule Name</label>
  //               <Input
  //                 value={schedule.name}
  //                 onChange={(e) => updateSchedule(scheduleIndex, "name", e.target.value)}
  //                 placeholder="e.g., Morning Batch"
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <label className="text-sm font-medium">Capacity</label>
  //               <Input
  //                 type="number"
  //                 value={schedule.capacity}
  //                 onChange={(e) => updateSchedule(scheduleIndex, "capacity", parseInt(e.target.value))}
  //                 className="[appearance:textfield]"
  //               />
  //             </div>
  //           </div>

  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <div className="space-y-2">
  //               <label className="text-sm font-medium">Start Date</label>
  //               <Popover>
  //                 <PopoverTrigger asChild>
  //                   <Button
  //                     variant="outline"
  //                     className={cn(
  //                       "w-full justify-start text-left font-normal",
  //                       !schedule.startDate && "text-muted-foreground"
  //                     )}
  //                   >
  //                     <CalendarIcon className="mr-2 h-4 w-4" />
  //                     {schedule.startDate ? format(schedule.startDate, "PPP") : "Select start date"}
  //                   </Button>
  //                 </PopoverTrigger>
  //                 <PopoverContent className="w-auto p-0">
  //                   <Calendar
  //                     mode="single"
  //                     selected={schedule.startDate}
  //                     onSelect={(date) => updateSchedule(scheduleIndex, "startDate", date)}
  //                     initialFocus
  //                   />
  //                 </PopoverContent>
  //               </Popover>
  //             </div>

  //             <div className="space-y-2">
  //               <label className="text-sm font-medium">End Date</label>
  //               <Popover>
  //                 <PopoverTrigger asChild>
  //                   <Button
  //                     variant="outline"
  //                     className={cn(
  //                       "w-full justify-start text-left font-normal",
  //                       !schedule.endDate && "text-muted-foreground"
  //                     )}
  //                   >
  //                     <CalendarIcon className="mr-2 h-4 w-4" />
  //                     {schedule.endDate ? format(schedule.endDate, "PPP") : "Select end date"}
  //                   </Button>
  //                 </PopoverTrigger>
  //                 <PopoverContent className="w-auto p-0">
  //                   <Calendar
  //                     mode="single"
  //                     selected={schedule.endDate}
  //                     onSelect={(date) => updateSchedule(scheduleIndex, "endDate", date)}
  //                     initialFocus
  //                   />
  //                 </PopoverContent>
  //               </Popover>
  //             </div>
  //           </div>

  //           <div className="space-y-4">
  //             <div className="space-y-2">
  //               <label className="text-sm font-medium">Select Days</label>
  //               <ToggleGroup
  //                 type="multiple"
  //                 value={schedule.days.map(d => d.day)}
  //                 onValueChange={(selectedDays) => {
  //                   daysOfWeek.forEach(day => {
  //                     const isSelected = selectedDays.includes(day);
  //                     const wasSelected = schedule.days.some(d => d.day === day);
  //                     if (isSelected !== wasSelected) handleDayToggle(scheduleIndex, day);
  //                   });
  //                 }}
  //                 className="grid grid-cols-7 gap-1"
  //               >
  //                 {daysOfWeek.map(day => (
  //                   <ToggleGroupItem
  //                     key={day}
  //                     value={day}
  //                     className="h-10 p-0 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
  //                   >
  //                     <span className="text-xs font-medium">{day}</span>
  //                   </ToggleGroupItem>
  //                 ))}
  //               </ToggleGroup>
  //             </div>

  //             {schedule.days.map((dayConfig, dayIndex) => (
  //               <div key={dayConfig.day} className="border rounded-lg p-4 bg-gradient-to-b from-muted/10 to-muted/5">
  //                 <div className="flex justify-between items-center mb-4">
  //                   <div className="flex items-center gap-2">
  //                     <Badge variant="secondary" className="font-medium">
  //                       {dayConfig.day}
  //                     </Badge>
  //                     <span className="text-sm text-muted-foreground">
  //                       {dayConfig.startTime} - {dayConfig.endTime}
  //                     </span>
  //                   </div>
  //                   <Button
  //                     variant="ghost"
  //                     size="sm"
  //                     className="text-red-500 hover:text-red-600"
  //                     onClick={() => handleDayToggle(scheduleIndex, dayConfig.day)}
  //                   >
  //                     <TrashIcon className="h-4 w-4" />
  //                   </Button>
  //                 </div>

  //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                   <div className="space-y-2">
  //                     <label className="text-sm font-medium flex items-center gap-2">
  //                       <ClockIcon className="h-4 w-4" />
  //                       Time Slot
  //                     </label>
  //                     <div className="flex gap-2">
  //                       <Input
  //                         type="time"
  //                         value={dayConfig.startTime}
  //                         onChange={(e) => updateDayField(scheduleIndex, dayIndex, "startTime", e.target.value)}
  //                         className="w-full"
  //                       />
  //                       <Input
  //                         type="time"
  //                         value={dayConfig.endTime}
  //                         onChange={(e) => updateDayField(scheduleIndex, dayIndex, "endTime", e.target.value)}
  //                         className="w-full"
  //                       />
  //                     </div>
  //                   </div>

  //                   <div className="space-y-2">
  //                     <label className="text-sm font-medium flex items-center gap-2">
  //                       <MapPinIcon className="h-4 w-4" />
  //                       Location
  //                     </label>
  //                     <Input
  //                       value={dayConfig.location || ""}
  //                       onChange={(e) => updateDayField(scheduleIndex, dayIndex, "location", e.target.value)}
  //                       placeholder="Training room 5"
  //                     />
  //                   </div>

  //                   <div className="space-y-2">
  //                     <label className="text-sm font-medium flex items-center gap-2">
  //                       <UserIcon className="h-4 w-4" />
  //                       Trainer
  //                     </label>
  //                     <Input
  //                       value={dayConfig.trainer || ""}
  //                       onChange={(e) => updateDayField(scheduleIndex, dayIndex, "trainer", e.target.value)}
  //                       placeholder="John Doe"
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );
  return <div>Not implemented</div>;
}