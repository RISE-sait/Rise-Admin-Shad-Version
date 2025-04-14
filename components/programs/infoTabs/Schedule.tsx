// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { PlusIcon, Trash2Icon, Clock, MapPinIcon, UsersIcon, CalendarIcon } from "lucide-react";
// import { format, parseISO } from "date-fns";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, FormProvider } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Team } from "@/services/teams";
// // import { ProgramEvent } from "../AddProgramForm";
// import { Location } from '@/types/location';

// export interface ScheduleProps {
//   events: ProgramEvent[];
//   onEventsChange: (events: ProgramEvent[]) => void;
//   locations: Location[];
//   teams: Team[];
//   programCapacity?: number;
// }

// const eventSchema = z.object({
//   location_id: z.string().min(1, "Location is required"),
//   team_id: z.string().optional(),
//   capacity: z.coerce.number().int().positive("Capacity must be a positive number"),
//   start_at: z.string().min(1, "Start time is required"),
//   end_at: z.string().min(1, "End time is required"),
// }).refine(data => {
//   const start = new Date(data.start_at);
//   const end = new Date(data.end_at);
//   return end > start;
// }, {
//   message: "End time must be after start time",
//   path: ["end_at"]
// });

// export default function ScheduleTab({ 
//   events, 
//   onEventsChange,
//   locations = [],
//   teams = [],
//   programCapacity = 10
// }: ScheduleProps) {
//   const [showEventForm, setShowEventForm] = useState(false);
  
//   const form = useForm<z.infer<typeof eventSchema>>({
//     resolver: zodResolver(eventSchema),
//     defaultValues: {
//       location_id: "",
//       team_id: "",
//       capacity: programCapacity,
//       start_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
//       end_at: format(new Date(new Date().getTime() + 60*60*1000), "yyyy-MM-dd'T'HH:mm"),
//     }
//   });

//   const addEvent = (data: z.infer<typeof eventSchema>) => {
//     const newEvent: ProgramEvent = {
//       id: crypto.randomUUID(), // Temporary ID for local state management
//       ...data,
//       location_name: locations.find(l => l.id === data.location_id)?.name,
//       team_name: data.team_id && data.team_id !== "none" ? teams.find(t => t.id === data.team_id)?.name : undefined
//     };

//     onEventsChange([...events, newEvent]);
//     setShowEventForm(false);
//     form.reset({
//       location_id: "",
//       team_id: "",
//       capacity: programCapacity,
//       start_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
//       end_at: format(new Date(new Date().getTime() + 60*60*1000), "yyyy-MM-dd'T'HH:mm"),
//     });
//   };

//   const removeEvent = (id: string) => {
//     onEventsChange(events.filter(event => event.id !== id));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4">
//         {events.length > 0 ? (
//           events.map((event) => (
//             <Card key={event.id} className="p-4 flex justify-between items-center">
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <Clock size={16} className="text-muted-foreground" />
//                   <span className="font-medium">
//                     {format(new Date(event.start_at), "MMM d, yyyy • h:mm a")} - {format(new Date(event.end_at), "h:mm a")}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <MapPinIcon size={16} className="text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">{event.location_name}</span>
//                 </div>
//                 {event.team_name && (
//                   <div className="flex items-center gap-2">
//                     <UsersIcon size={16} className="text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">Team: {event.team_name}</span>
//                   </div>
//                 )}
//                 <div className="flex items-center gap-2">
//                   <UsersIcon size={16} className="text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">Capacity: {event.capacity}</span>
//                 </div>
//               </div>
//               <Button 
//                 size="icon" 
//                 variant="ghost" 
//                 className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                 onClick={() => removeEvent(event.id)}
//               >
//                 <Trash2Icon size={18} />
//               </Button>
//             </Card>
//           ))
//         ) : (
//           <div className="text-center py-8 text-muted-foreground">
//             No events scheduled yet. Add one below.
//           </div>
//         )}

//         {!showEventForm && (
//           <Button 
//             variant="outline" 
//             className="border-dashed"
//             onClick={() => setShowEventForm(true)}
//           >
//             <PlusIcon className="mr-2 h-4 w-4" /> Add Event
//           </Button>
//         )}

//         {showEventForm ? (
//           <Card className="p-4 border-dashed border-2">
//             <FormProvider {...form}>
//               <form onSubmit={form.handleSubmit(addEvent)} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="start_at"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Start Date & Time</FormLabel>
//                         <FormControl>
//                           <Input type="datetime-local" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="end_at"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>End Date & Time</FormLabel>
//                         <FormControl>
//                           <Input type="datetime-local" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="location_id"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Location</FormLabel>
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select location" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {locations.map(location => (
//                               <SelectItem key={location.id} value={location.id}>
//                                 {location.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="team_id"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Team (Optional)</FormLabel>
//                         <Select onValueChange={field.onChange} value={field.value || "none"}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select a team" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="none">None</SelectItem>
//                             {teams.map(team => (
//                               <SelectItem key={team.id} value={team.id}>
//                                 {team.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <FormField
//                   control={form.control}
//                   name="capacity"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Capacity</FormLabel>
//                       <FormControl>
//                         <Input type="number" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="flex justify-end gap-2">
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     onClick={() => setShowEventForm(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit">
//                     Add Event
//                   </Button>
//                 </div>
//               </form>
//             </FormProvider>
//           </Card>
//         ) : null}
//       </div>
//     </div>
//   );
// }