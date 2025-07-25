"use client";

import { useEffect, useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import RightDrawer from "@/components/reusable/RightDrawer";
import { useCalendarContext } from "../calendar-context";
import EditEventForm from "../event/EditEventForm";

export default function CalendarManageEventDrawer() {
  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    events,
    setEvents,
  } = useCalendarContext();

  const [showEditForm, setShowEditForm] = useState(false);

  function handleDelete() {
    if (!selectedEvent) return;
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    handleClose();
  }

  function handleClose() {
    setManageEventDialogOpen(false);
    setSelectedEvent(null);
    // form.reset()
    setShowEditForm(false);
  }

  return (
    <RightDrawer
      drawerOpen={manageEventDialogOpen}
      handleDrawerClose={handleClose}
      drawerWidth="w-[40%]"
    >
      {selectedEvent && (
        <div className="p-6 space-y-6">
          {showEditForm ? (
            <EditEventForm onClose={handleClose} />
          ) : (
            <>
              <h1 className="text-xl font-semibold">
                {selectedEvent.program.name || "Unnamed Event"}
              </h1>
              <p className="text-base text-muted-foreground">
                Date:{" "}
                {selectedEvent.start_at.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-base text-muted-foreground">
                Start Time:{" "}
                {selectedEvent.start_at.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-base text-muted-foreground">
                End Time:{" "}
                {selectedEvent.end_at.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-base text-muted-foreground">
                {selectedEvent.location.name}
              </p>
              <p className="text-base text-muted-foreground">
                {selectedEvent.location.address}
              </p>
              {selectedEvent.team?.name && (
                <p className="text-base text-muted-foreground">
                  Team: {selectedEvent.team.name}
                </p>
              )}
              {((selectedEvent as any).court_name ||
                (selectedEvent as any).court ||
                (selectedEvent as any).court?.name) && (
                <p className="text-base text-muted-foreground">
                  Court:{" "}
                  {(selectedEvent as any).court_name ||
                    (selectedEvent as any).court?.name ||
                    (selectedEvent as any).court}
                </p>
              )}
              <Separator />
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowEditForm(true)}
                >
                  Edit this Event
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
      )}
    </RightDrawer>
  );
}
