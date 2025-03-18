"use client";
import { useState } from "react";
import Link from "next/link";

type Barber = {
  id: number;
  name: string;
  image: string;
  availability: "Available" | "Unavailable";
  unavailableUntil?: string;
};

export default function ManageBarbersPage() {
  const [barbers] = useState<Barber[]>([
    { id: 1, name: "Alen Reni Thomas", image: "/Alen Reni Thomas.png", availability: "Available" },
    { id: 2, name: "Sarah Lee", image: "/Alen Reni Thomas.png", availability: "Unavailable", unavailableUntil: "2024-03-15" },
    { id: 3, name: "Mike Johnson", image: "/Alen Reni Thomas.png", availability: "Available" },
  ]);

  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [availability, setAvailability] = useState<"Available" | "Unavailable">("Available");
  const [unavailableDate, setUnavailableDate] = useState("");

  const handleSave = () => {
    setSelectedBarber(null);
  };

  return (
    <div className="p-6 space-y-6 bg-black text-white">
      {/* Header Section */}
      <div className="space-y-4">
        <Link href="/manage/barbershop">
          <Button className="bg-black text-white border border-gray-800 hover:bg-yellow-500 hover:text-black">
            ← Back to Barbershop
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Manage Barbers</h1>
        <p className="text-gray-400">View and manage barber availability</p>
      </div>

      {/* Barber Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {barbers.map(barber => (
          <Card key={barber.id}>
            <img src={barber.image} alt={barber.name} className="w-full h-48 object-cover rounded-t-xl" />
            <div className="p-4">
              <h3 className="text-xl font-bold">{barber.name}</h3>
              <p className={`mt-2 ${barber.availability === "Available" ? "text-green-400" : "text-red-400"}`}>
                {barber.availability}
                {barber.unavailableUntil && <span className="text-gray-400 block">Until {barber.unavailableUntil}</span>}
              </p>
              <Button 
                className="w-full mt-4 bg-black text-white border border-gray-800 hover:bg-yellow-500 hover:text-black"
                onClick={() => setSelectedBarber(barber)}
              >
                Edit Availability
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal - Black Theme */}
      {selectedBarber && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-xl border border-gray-800 w-96">
            <h2 className="text-2xl font-bold mb-4">Edit {selectedBarber.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Availability Status</label>
                <select
                  value={availability}
                  onChange={e => setAvailability(e.target.value as any)}
                  className="w-full p-2 bg-gray-900 text-white rounded-md border border-gray-800"
                >
                  <option className="bg-black">Available</option>
                  <option className="bg-black">Unavailable</option>
                </select>
              </div>

              {availability === "Unavailable" && (
                <div>
                  <label className="block text-gray-300 mb-2">Unavailable Until</label>
                  <input
                    type="date"
                    value={unavailableDate}
                    onChange={e => setUnavailableDate(e.target.value)}
                    className="w-full p-2 bg-gray-900 text-white rounded-md border border-gray-800"
                  />
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button 
                  className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
                <Button 
                  className="flex-1 bg-gray-900 text-white hover:bg-gray-800 border border-gray-800"
                  onClick={() => setSelectedBarber(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Components with Black Theme
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-black rounded-xl border border-gray-800 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button 
    className={`px-4 py-2 rounded-md transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </button>
);