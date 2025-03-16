"use client"; // Ensures this is a client component

import { useState } from "react";
import Link from "next/link";

type Barber = {
  id: number;
  name: string;
  image: string;
  availability: "Available" | "Unavailable";
  unavailableUntil?: string; // Optional field if the barber is unavailable
};

export default function ManageBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([
    {
      id: 1,
      name: "Alen Reni Thomas",
      image: "/Alen Reni Thomas.png",
      availability: "Available",
    },
    {
      id: 2,
      name: "Sarah Lee",
      image: "/Alen Reni Thomas.png",
      availability: "Unavailable",
      unavailableUntil: "2024-03-15",
    },
    {
      id: 3,
      name: "Mike Johnson",
      image: "/Alen Reni Thomas.png",
      availability: "Available",
    },
  ]);

  // State for managing the selected barber and edit modal
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [availability, setAvailability] = useState<"Available" | "Unavailable">("Available");
  const [unavailableUntil, setUnavailableUntil] = useState<string>("");

  const handleEditClick = (barber: Barber) => {
    setSelectedBarber(barber);
    setAvailability(barber.availability);
    setUnavailableUntil(barber.unavailableUntil || "");
  };

  const handleSaveChanges = () => {
    if (selectedBarber) {
      const updatedBarbers = barbers.map((barber) =>
        barber.id === selectedBarber.id
          ? { ...barber, availability, unavailableUntil: availability === "Unavailable" ? unavailableUntil : undefined }
          : barber
      );
      setBarbers(updatedBarbers);
      setSelectedBarber(null); // Close the modal
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 px-6">
      <div className="w-full max-w-7xl space-y-6">

        {/* Back Button */}
        <div className="mb-4">
          <Link href="/manage/barbershop">
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md text-sm">
              ← Back to Barbershop
            </button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-xl border border-gray-800">
          <h1 className="text-4xl font-bold text-center text-white">Manage Barbers</h1>
          <p className="text-gray-400 text-lg text-center mt-2">
            View and manage your barber's availability and details.
          </p>
        </div>

        {/* Barber Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-gray-950 p-6 rounded-xl shadow-md border border-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={barber.image}
                alt={barber.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{barber.name}</h3>
              <p className="text-gray-400 mt-2">
                Availability:{" "}
                <span
                  className={`font-semibold ${
                    barber.availability === "Available"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {barber.availability}
                </span>
                {barber.availability === "Unavailable" && barber.unavailableUntil && (
                  <span className="text-gray-500"> - Off until {barber.unavailableUntil}</span>
                )}
              </p>

              {/* Edit Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleEditClick(barber)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {selectedBarber && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-gray-950 p-6 rounded-xl shadow-xl border border-gray-800 w-96">
              <h2 className="text-2xl font-semibold text-white mb-4">Edit Barber: {selectedBarber.name}</h2>

              {/* Availability Dropdown */}
              <div className="mb-4">
                <label className="text-gray-300">Availability</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as "Available" | "Unavailable")}
                  className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              {/* Unavailable Until Date */}
              {availability === "Unavailable" && (
                <div className="mb-4">
                  <label className="text-gray-300">Unavailable Until</label>
                  <input
                    type="date"
                    value={unavailableUntil}
                    onChange={(e) => setUnavailableUntil(e.target.value)}
                    className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedBarber(null)} // Close the modal
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
