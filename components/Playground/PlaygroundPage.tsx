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

// Main page for managing room bookings
export default function PlaygroundPage() {
  // State for all bookings and UI interactions
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<RoomBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<
    "details" | "add" | "edit" | null
  >(null);

  // Load sample bookings on mount
  useEffect(() => {
    const sample = [
      {
        id: "1",
        customer_name: "John Doe",
        room_number: "1",
        start_at: new Date().toISOString(),
      },
      {
        id: "2",
        customer_name: "Jane Smith",
        room_number: "2",
        start_at: new Date().toISOString(),
      },
    ];
    setBookings(sample);
    setFilteredBookings(sample);
  }, []);

  // Filter bookings when search input changes
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

  // Booking statistics
  const stats = {
    bookingsThisWeek: bookings.length,
    totalBookings: bookings.length,
    openRooms: Math.max(0, 4 - bookings.length),
  };

  // Event handlers for booking interactions
  const handleBookingSelect = (booking: RoomBooking) => {
    setSelectedBooking(booking);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleAddBooking = (booking: RoomBooking) => {
    setBookings((prev) => [...prev, booking]);
    setDrawerOpen(false);
  };

  const handleUpdateBooking = (booking: RoomBooking) => {
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? booking : b)));
    setDrawerOpen(false);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setDrawerOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <Heading title="Playground" description="Manage game room bookings" />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Booking
        </Button>
      </div>
      <Separator />

      {/* Booking stats */}
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

      {/* Right drawer for details, add, or edit forms */}
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
                  ? "Add Booking"
                  : "Edit Booking"}
            </h2>
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
                  drawerContent === "edit"
                    ? (selectedBooking ?? undefined)
                    : undefined
                }
                onSave={
                  drawerContent === "add"
                    ? handleAddBooking
                    : handleUpdateBooking
                }
                onCancel={() => setDrawerOpen(false)}
              />
            )}
          </div>
        </RightDrawer>
      )}
    </div>
  );
}
