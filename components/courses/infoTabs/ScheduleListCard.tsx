// import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Schedule } from "@/types/schedule";
// import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

// function mapDay(day: string) {
//     switch (day) {
//         case "M":
//             return "Monday";
//         case "Tues":
//             return "Tuesday";
//         case "W":
//             return "Wednesday";
//         case "Thurs":
//             return "Thursday";
//         case "F":
//             return "Friday";
//         case "Sat":
//             return "Saturday";
//         case "Sun":
//             return "Sunday";
//     }
// }

// export default function ScheduleListCard({ schedule }: { schedule: Schedule }) {


//     //   const { data, updateField, isChanged, resetData } = useFormData({
//     //     name: course.name,
//     //     startDate: course.start_date ? parseISO(course.start_date) : null,
//     //     endDate: course.end_date ? parseISO(course.end_date) : null,
//     //     description: course.description
//     //   });


//     return (
//         <div>

//             <div>
//                 <p className="text-base font-semibold ">
//                     Day <span className="text-red-500">*</span>

//                 </p>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant={"outline"}>{mapDay(schedule.day)}</Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                         {
//                             ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//                                 .map((day) => (
//                                     <DropdownMenuItem key={day}
//                                         onSelect={() => { }}
//                                     >
//                                         {day}
//                                     </DropdownMenuItem>
//                                 ))
//                         }
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>

//         </div >
//     )
// }