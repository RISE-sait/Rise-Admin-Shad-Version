// // Removed MUI imports (Card, CardContent, Typography, Grid, Box, Divider)
// import { useToast } from "@/hooks/use-toast";
// import { useEffect, useState } from "react";
// import ScheduleListCard from "./ScheduleListCard";
// import { Schedule } from "@/types/schedule";

// export default function SchedulesTab({ courseId }: { courseId: string }) {

//   const [schedules, setSchedules] = useState<Schedule[]>([])

//   useEffect(() => {
//     // Fetch the schedules based on the courseId
//     (async () => {
//       const response = await fetch("http://localhost:8080/api/schedules?course_id=" + courseId)

//       if (!response.ok) {
//         console.error("Failed to fetch schedules")
//         console.error(await response.text())
//         return
//       }

//       const schedules = await response.json()

//       setSchedules(schedules)
//     })()
//   }, [courseId])

//   const { toast } = useToast()

//   const [nameInputEnabled, setNameInputEnabled] = useState(false)
//   const [startDateInputEnabled, setStartDateInputEnabled] = useState(false)
//   const [endDateInputEnabled, setEndDateInputEnabled] = useState(false)
//   const [descriptionInputEnabled, setDescriptionInputEnabled] = useState(false)

//   return (
//     <div className="p-4 space-y-4">
//       {
//         schedules.map((schedule) => (
//           <ScheduleListCard key={schedule.id} schedule={schedule} />
//         ))
//       }
//     </div>
//   )
// }