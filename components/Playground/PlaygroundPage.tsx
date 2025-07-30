// PlaygroundPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import PlaygroundTable, { RoomBooking } from "./PlaygroundTable";
import RightDrawer from "@/components/reusable/RightDrawer";
import AddBookingForm from "./AddBookingForm";
import BookingInfoPanel from "./BookingInfoPanel";
import { PlaygroundSession, PlaygroundSystem } from "@/types/playground";

interface PlaygroundPageProps {
  sessions: PlaygroundSession[];
  systems: PlaygroundSystem[];
}

// Main page for managing room bookings
export default function PlaygroundPage({
  sessions,
  systems,
}: PlaygroundPageProps) {
  // State variables for UI and data
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [availableSystems, setAvailableSystems] =
    useState<PlaygroundSystem[]>(systems);
  const [filteredBookings, setFilteredBookings] = useState<RoomBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<
    "details" | "add" | "edit" | null
  >(null);

  // Map server sessions into table bookings on mount or sessions change
  useEffect(() => {
    const mapped = sessions.map((s) => ({
      id: s.id,
      customer_name: `${s.customer_first_name} ${s.customer_last_name}`,
      system_name: s.system_name,
      start_at: s.start_time.toISOString(),
    }));
    setBookings(mapped);
    setFilteredBookings(mapped);
  }, [sessions]);

  // Update available systems when the prop changes
  useEffect(() => {
    setAvailableSystems(systems);
  }, [systems]);

  // Filter bookings list when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = bookings.filter((b) =>
        b.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchQuery, bookings]);

  // Simple stats (could be expanded)
  const stats = {
    bookingsThisWeek: bookings.length,
    totalBookings: bookings.length,
    openRooms: Math.max(0, 4 - bookings.length),
  };

  // Open details drawer on row click
  const handleBookingSelect = (booking: RoomBooking) => {
    setSelectedBooking(booking);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  // Drawer close handlers
  const handleAddBooking = () => setDrawerOpen(false);
  const handleUpdateBooking = () => setDrawerOpen(false);
  const handleDeleteBooking = (id: string) => {
    setDrawerOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      {/* Header with Add Session / Add System buttons */}
      <div className="flex items-center justify-between">
        <Heading title="Playground" description="Manage game room bookings" />
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setDrawerContent("add");
              setDrawerOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Session
          </Button>
        </div>
      </div>
      <Separator />

      {/* Stats grid (placeholders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="..."> {/* Bookings This Week */} </div>
        <div className="..."> {/* Total Bookings */} </div>
        <div className="..."> {/* Open Rooms */} </div>
      </div>

      {/* Search input */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bookings table */}
      <PlaygroundTable
        bookings={filteredBookings}
        onBookingSelect={handleBookingSelect}
      />

      {/* Right drawer for details or forms */}
      {drawerOpen && (
        <RightDrawer
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          drawerWidth="w-[400px]"
        >
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
              {drawerContent === "details"
                ? "Booking Details"
                : drawerContent === "add"
                  ? "Add Session"
                  : "Edit Session"}
            </h2>

            {/* Conditionally render panel or forms */}
            {drawerContent === "details" && selectedBooking && (
              <BookingInfoPanel
                booking={selectedBooking}
                onEdit={(b) => {
                  setSelectedBooking(b);
                  setDrawerContent("edit");
                }}
                onDelete={handleDeleteBooking}
              />
            )}
            {(drawerContent === "add" || drawerContent === "edit") && (
              <AddBookingForm
                initialData={
                  drawerContent === "edit" && selectedBooking
                    ? sessions.find((s) => s.id === selectedBooking.id)
                    : undefined
                }
                systems={availableSystems}
                onClose={() => setDrawerOpen(false)}
              />
            )}
          </div>
        </RightDrawer>
      )}
    </div>
  );
}
