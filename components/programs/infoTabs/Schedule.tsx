import { useEffect, useState } from "react"
import { useToast } from '@/hooks/use-toast';
import { useUser } from "@/contexts/UserContext";
import getValue from '@/configs/constants';
import { getSchedulesOfProgram } from "@/services/events";
import { Card } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EventSchedule } from "@/types/events";
import { getAllLocations } from "@/services/location";
import { Location } from "@/types/location";
import { getAllTeams } from "@/services/teams";
import { Team } from "@/types/team";
import { PlusIcon, SaveIcon, TrashIcon } from "lucide-react";

export default function SchedulesTab({ programID }: { programID: string }) {

    const { user } = useUser();
    const jwt = user?.Jwt
    const { toast } = useToast();

    const [schedules, setSchedules] = useState<EventSchedule[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            try {

                setLoading(true)

                const schedules = await getSchedulesOfProgram(programID)

                setSchedules(schedules)
            }
            catch (error) {
                console.error("Failed to fetch schedules", error);
                toast({
                    description: "Failed to fetch schedules",
                    status: "error",
                    variant: "destructive"
                });
            }
            finally {
                setLoading(false)
            }
        })()
    }, [programID])

    return (
        <div>
            {

                loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
                    </div>
                ) : (

                    schedules.length > 0 ? (
                        <div className="grid grid-cols-1">
                            {schedules.map((schedule) => {

                                const key = `${schedule.day}-${schedule.recurrence_start_at.toISOString()}-${schedule.location}`;

                                return (
                                    <ScheduleCard key={key} schedule={schedule} />
                                )
                            }
                            )}
                        </div>
                    )
                        :
                        <p>No schedules available for this program.</p>
                )
            }
        </div>
    )
}

function ScheduleCard({ schedule }: { schedule: EventSchedule }) {

    const { toast } = useToast();

    const form = useForm({
        defaultValues: {
            recurrence_start_at: schedule.recurrence_start_at.toISOString().slice(0, 16),
            recurrence_end_at: schedule.recurrence_end_at.toISOString().slice(0, 16),
            event_start_at: schedule.event_start_at,
            event_end_at: schedule.event_end_at,
            day: schedule.day,
            location_name: schedule.location?.name,
            team_name: schedule.team?.name,
        },
    })

    const [locations, setLocations] = useState<Location[]>([])
    const [teams, setTeams] = useState<Team[]>([])

    const handleDeleteSchedule = () => {
    }

    const handleSave = () => {
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
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                        >
                            
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Another Schedule
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Card>
    )
}
