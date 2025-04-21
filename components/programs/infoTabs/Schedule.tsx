import { useEffect, useState } from "react"
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { EventSchedule } from "@/types/events";
import { PlusIcon } from "lucide-react";
import ScheduleCard from "./ScheduleCard";
import { getSchedulesOfProgram } from "@/services/events";

export default function SchedulesTab({ programID, capacity }: { programID: string, capacity?: number }) {

    const { toast } = useToast()

    const [schedules, setSchedules] = useState<EventSchedule[]>([])
    const [loading, setLoading] = useState(false)

    function addScheduleCard() {

        setSchedules((prev) => {

            const newSchedule: EventSchedule = {
                program: {
                    id: programID,
                    name: "",
                    type: "",
                },
                location: {
                    id: "",
                    name: "",
                    address: "",
                },
                team: {
                    id: "",
                    name: "",
                },
                recurrence_start_at: new Date(),
                recurrence_end_at: new Date(),
                event_start_at: "",
                event_end_at: "",
                day: "Monday",
            }

            return [...prev, newSchedule]
        })
    }

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
                        <div className="grid grid-cols-1 gap-y-10">
                            {schedules.map((schedule) => {

                                const key = `${schedule.day}-${schedule.recurrence_start_at.toISOString()}-${schedule.location}`;

                                return (
                                    <ScheduleCard key={key} schedule={schedule} capacity={capacity} />
                                )
                            }
                            )}

                        </div>
                    )
                        :
                        <p className="text-center">No schedules available for this program.</p>
                )
            }
            <div className="flex justify-end mt-10">
                <Button
                    className="bg-green-600 hover:bg-green-700 w-min"
                    onClick={addScheduleCard}
                >

                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Another Schedule
                </Button>
            </div>
        </div>
    )
}