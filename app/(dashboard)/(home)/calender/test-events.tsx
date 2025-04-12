// pages/test-events.tsx
"use client";

import { useEffect } from "react";
import { getAllEvents } from "@/services/events"; // Adjust the import path

export default function TestEvents() {
  useEffect(() => {
    const testGetAllEvents = async () => {
      try {
        console.log("Testing getAllEvents...");
        const events = await getAllEvents({
          after: "2024-01-01",
          before: "2026-01-01",
        });
        console.log("Events fetched successfully:", events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    testGetAllEvents();
  }, []);

  return (
    <div>
      <h1>Test Events Service</h1>
      <p>Check the console for results.</p>
    </div>
  );
}