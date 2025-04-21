import { useUser } from "@/contexts/UserContext"
import { useToast } from "@/hooks/use-toast"
import { deleteEvents, getEvents, getSchedulesOfProgram, createEvents } from "@/services/events";
import { EventSchedule } from "@/types/events"
import { Team } from "@/types/team"
import { Location } from "@/types/location";
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { getAllLocations } from "@/services/location";
import { Card } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { getAllTeams } from "@/services/teams";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { TrashIcon, SaveIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ScheduleCard({ schedule, capacity, isAddCard = false }: { schedule: EventSchedule, capacity?: number, isAddCard?: boolean }) {

    const { toast } = useToast()

    const { user } = useUser()
    const jwt = user?.Jwt

    const form = useForm({
        defaultValues: {
            recurrence_start_at: schedule.recurrence_start_at.toISOString().slice(0, 16) as string,
            recurrence_end_at: schedule.recurrence_end_at.toISOString().slice(0, 16) as string,
            event_start_at: schedule.event_start_at as string,
            event_end_at: schedule.event_end_at as string,
            day: schedule.day as string,
            location_name: schedule.location?.name as string,
            team_name: schedule.team?.name as string,
            capacity: capacity,
        },
    })

    const [locations, setLocations] = useState<Location[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [eventIDs, setEventIDs] = useState<string[]>([])

    async function handleDeleteSchedule(event: React.MouseEvent) {
        try {

            event.preventDefault()
            // await deleteEvents({
            //     ids: eventIDs,
            // }, jwt!)
            toast({
                description: "Schedule deleted successfully",
                status: "success",
                variant: "default"
            })
        }
        catch (error) {
            console.error("Failed to delete schedule", error);
            toast({
                description: error instanceof Error ? error.message : "Failed to delete schedule",
                status: "error",
                variant: "destructive"
            });
        }
    }

    async function handleCreateSchedule(event: React.MouseEvent) {
        try {

            event.preventDefault()

            const location = locations.find(loc => loc.name === form.getValues("location_name"))
            const team = teams.find(team => team.name === form.getValues("team_name"))

            const formatTimeToISO = (timeStr: string) => {
                const [hours, minutes] = timeStr.split(':')
                return `${hours}:${minutes}:00+00:00`
            }

            await createEvents({
                program_id: schedule.program?.id,
                location_id: location?.id,
                team_id: team?.id,
                recurrence_start_at: new Date(form.getValues('recurrence_start_at')).toISOString(),
                recurrence_end_at: new Date(form.getValues('recurrence_end_at')).toISOString(),
                event_start_at: formatTimeToISO(form.getValues('event_start_at')),
                event_end_at: formatTimeToISO(form.getValues('event_end_at')),
                capacity: form.getValues('capacity'),
                day: form.getValues('day'),
            }, jwt!)

            toast({
                description: "Schedule created successfully",
                status: "success",
                variant: "default"
            })
        }
        catch (error) {
            console.error("Failed to create schedule", error);
            toast({
                description: error instanceof Error ? error.message : "Failed to create schedule",
                status: "error",
                variant: "destructive"
            });
        }
    }

    async function handleSave(event: React.MouseEvent) {
        event.preventDefault()

        if (isAddCard) {
            await handleCreateSchedule(event)
        }
    }

    const isFormChanged = () => {
        const currentValues = form.getValues()
        const defaultValues = form.formState.defaultValues!

        return Object.keys(currentValues).some((key) => {
            const currentValue = currentValues[key as keyof typeof currentValues]
            const defaultValue = defaultValues[key as keyof typeof defaultValues]

            return currentValue !== defaultValue
        }
        )
    }

    const handleReset = () => form.reset(form.formState.defaultValues!)

    useEffect(() => {
        (async () => {
            try {

                // const after = new Date(schedule.recurrence_start_at.getTime() - 24 * 60 * 60 * 1000)
                // const before = new Date(schedule.recurrence_end_at.getTime() + 24 * 60 * 60 * 1000)

                // // after and before should be in YYYY-MM-DD
                // const [events] = await Promise.all([getEvents({
                //     program_id: schedule.program?.id,
                //     location_id: schedule.location?.id,
                //     after: after.toISOString().slice(0, 10),
                //     before: before.toISOString().slice(0, 10),
                // })])

                // const ids = events.map(event => event.id!) ?? []
                // setEventIDs(ids)
            }
            catch (error) {
                console.error("Failed to fetch events", error);
                toast({
                    description: error instanceof Error ? error.message : "Failed to fetch events",
                    status: "error",
                    variant: "destructive"
                });
            }
        })()
    }, [schedule.program?.id])


    useEffect(() => {
        (async () => {
            try {

                const [locations, teams] = await Promise.all([getAllLocations(), getAllTeams()])
                setLocations(locations)
                setTeams(teams)

            } catch (error) {
                console.error("Failed to fetch locations and teams", error);
                toast({
                    description: "Failed to fetch locations and teams",
                    status: "error",
                    variant: "destructive"
                });
            }
        })()
    }, [])

    return (
        <Card className="p-4 border-dashed border-2">
            <FormProvider {...form}>
                <form onSubmit={() => { }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="recurrence_start_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recurrence Start Date & Time</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="recurrence_end_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recurrence End Date & Time</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_start_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_end_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event End Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="day"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Day</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                                                .map(day => (
                                                    <SelectItem key={day} value={day.toUpperCase()}>
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations.map(location => (
                                                <SelectItem key={location.id} value={location.name}>
                                                    {location.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capacity</FormLabel>
                                    <Input type="number" {...field} placeholder="NULL" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="team_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team (Optional)</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a team" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {teams.map(team => (
                                                <SelectItem key={team.id} value={team.name}>
                                                    {team.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleDeleteSchedule}
                            className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                        <Button
                            variant="default"
                            type="reset"
                            onClick={handleReset}
                            disabled={!isFormChanged()}
                        >
                            Reset to Default
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!isFormChanged()}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <SaveIcon className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>

                    </div>
                </form>
            </FormProvider>
        </Card>
    )
}
