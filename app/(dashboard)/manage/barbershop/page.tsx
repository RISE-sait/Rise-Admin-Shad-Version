"use client"; // Ensures this is a client component

import Link from "next/link";
import { useState } from "react";

type Appointment = {
  id: number;
  customer: string;
  date: string;
  status: "Upcoming" | "Completed" | "Cancelled";
};

export default function BarbershopPage() {
  // Sample appointment data
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, customer: "Alen Reni Thomas", date: "2024-03-10", status: "Upcoming" },
    { id: 2, customer: "AlenDaGuy", date: "2024-03-05", status: "Completed" },
    { id: 3, customer: "AlenDaMan", date: "2024-03-02", status: "Cancelled" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex justify-center py-12 px-6">
      <div className="w-full max-w-7xl space-y-10">

        {/* Header + Quick Actions Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-xl border border-gray-800">
          {/* Title */}
          <h1 className="text-4xl font-bold flex items-center gap-3 justify-center">
            💈 <span className="text-white">RISE Barbershop</span>
          </h1>
          <p className="text-gray-400 text-lg text-center mt-2">
          Manage your appointments, control your availability, update your portfolio, and stay on top of your schedule!
          </p>

          {/* Quick Actions (Centered Below Title) */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {[ 
              { label: "View All Appointments", href: "/manage/barbershop/dashboard", color: "bg-blue-600 hover:bg-blue-500" },
              { label: "Manage Barbers", href: "/manage/barbershop/barbers", color: "bg-yellow-500 hover:bg-yellow-400" },
              { label: "Update Services", href: "/manage/barbershop/services", color: "bg-green-600 hover:bg-green-500" },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <button className={`px-5 py-3 ${action.color} text-white rounded-md shadow-md transition-transform hover:scale-105`}>
                  {action.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { title: "Total Appointments", value: "124", icon: "📅", color: "text-blue-400" },
            { title: "Active Barbers", value: "8", icon: "✂️", color: "text-green-400" },
            { title: "Customer Reviews", value: "4.8/5", icon: "⭐", color: "text-yellow-400" },
            { title: "Time Off Requests", value: "2", icon: "🛑", color: "text-red-400" },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-950 p-6 rounded-lg shadow-md border border-gray-800 transition-transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-md text-gray-400 flex items-center gap-2">{stat.icon} {stat.title}</h3>
              <p className={`text-4xl font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Appointments Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-md border border-gray-800">
          <h2 className="text-2xl font-semibold mb-3">Appointments</h2>
          <div className="mt-4 border p-4 rounded-lg bg-gray-900">
            {appointments.length === 0 ? (
              <p className="text-gray-400">No appointments found.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-3 text-gray-400">Customer</th>
                    <th className="text-left p-3 text-gray-400">Date</th>
                    <th className="text-left p-3 text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                      <td className="p-3">{appt.customer}</td>
                      <td className="p-3">{appt.date}</td>
                      <td
                        className={`p-3 font-semibold ${
                          appt.status === "Upcoming"
                            ? "text-blue-400"
                            : appt.status === "Completed"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {appt.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-md border border-gray-800">
          <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-lg">
            <li className="flex items-center gap-3">📅 Manage upcoming & past appointments</li>
            <li className="flex items-center gap-3">🛑 Easily schedule time off</li>
            <li className="flex items-center gap-3">📸 Upload and showcase your portfolio</li>
            <li className="flex items-center gap-3">✏️ Modify, cancel, or reschedule bookings</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
