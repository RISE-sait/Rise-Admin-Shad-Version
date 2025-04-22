import { useEffect, useState } from "react"
import { useToast } from '@/hooks/use-toast';
import { EventSchedule } from "@/types/events";
import ScheduleCard from "./ScheduleCard";
import { getSchedulesOfProgram } from "@/services/events";

export default function SchedulesTab({ programID }: { programID: string }) {

    const { toast } = useToast()

    const [schedules, setSchedules] = useState<EventSchedule[]>([])
    const [loading, setLoading] = useState(false)

    // Fetch schedules of the program
    async function fetchSchedules() {
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
    }

    useEffect(() => {
        fetchSchedules()
    }, [programID])


    function onDeleteSchedule(id: string) {
        setSchedules((prev) => prev.filter((schedule) => schedule.id !== id))
    }

    return (
        <div>
            {
                loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
                    </div>
                ) : (


                    <div className="grid grid-cols-1 gap-y-10">
                        {schedules.map((schedule) => {

                            const key = `${schedule.day}-${schedule.recurrence_start_at.toISOString()}-${schedule.location}`;

                            return (
                                <ScheduleCard refreshSchedules={fetchSchedules} onDeleteSchedule={onDeleteSchedule} key={key} schedule={schedule} />
                            )
                        }
                        )}

                        <ScheduleCard
                            onDeleteSchedule={onDeleteSchedule}
                            refreshSchedules={fetchSchedules}
                            isAddCard={true}
                            schedule={{
                                id: "",
                                day: "Monday",
                                location: {
                                    id: "",
                                    name: "",
                                    address: "",
                                },
                                recurrence_start_at: new Date(),
                                recurrence_end_at: new Date(),
                                event_start_at: "",
                                event_end_at: "",
                                program: {
                                    id: programID,
                                    name: "",
                                    type: "",
                                },
                                team: {
                                    id: "",
                                    name: "",
                                }
                            }}
                        />
                    </div>
                )
            }
        </div>
    )
}