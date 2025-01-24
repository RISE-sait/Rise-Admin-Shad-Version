import { useState } from "react";

export const useDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add">("details");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const openDrawer = (content: "details" | "add", event?: Event) => {
    setDrawerContent(content);
    if (content === "details" && event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedEvent(null);
  };

  return {
    drawerOpen,
    drawerContent,
    selectedEvent,
    openDrawer,
    closeDrawer,
  };
};