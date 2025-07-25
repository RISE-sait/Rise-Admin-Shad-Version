"use client";

import RightDrawer from "@/components/reusable/RightDrawer";
import { useCalendarContext } from "../calendar-context";
import AddEventForm from "../event/AddEventForm";

export default function CalendarNewEventDrawer() {
  const { newEventDialogOpen, setNewEventDialogOpen } = useCalendarContext();

  const handleClose = () => setNewEventDialogOpen(false);

  return (
    <RightDrawer
      drawerOpen={newEventDialogOpen}
      handleDrawerClose={handleClose}
      drawerWidth="w-[40%]"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Add Event</h2>
        <AddEventForm onClose={handleClose} />
      </div>
    </RightDrawer>
  );
}
