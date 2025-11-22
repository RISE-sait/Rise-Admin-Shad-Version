import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCalendarContext } from '../../calendar-context'
import { useUser } from '@/contexts/UserContext'
import { StaffRoleEnum } from '@/types/user'

export default function CalendarHeaderActionsAdd() {
  const { setNewEventDialogOpen } = useCalendarContext()
  const { user } = useUser()
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST

  if (isReceptionist) return null

  return (
    <Button
      className="flex items-center gap-1 bg-primary text-white dark:text-black"
      onClick={() => setNewEventDialogOpen(true)}
    >
      <Plus />
      Add Event
    </Button>
  )
}
