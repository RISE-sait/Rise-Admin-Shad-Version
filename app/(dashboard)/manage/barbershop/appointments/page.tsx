"use client";
import { useState } from "react";
import Link from "next/link";

type Appointment = {
  id: number;
  customer: string;
  date: string;
  status: "Upcoming" | "Completed" | "Cancelled";
};

export default function BarberDashboard() {
  // Sample appointments (You can replace this with an API later)
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, customer: "John Doe", date: "2024-03-10", status: "Upcoming" },
    { id: 2, customer: "Jane Smith", date: "2024-03-05", status: "Completed" },
    { id: 3, customer: "Mike Johnson", date: "2024-03-02", status: "Cancelled" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex justify-center py-12 px-6">
      <div className="w-full max-w-7xl space-y-10">

        {/* Header Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-xl border border-gray-800 text-center">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-3">
            📊 <span className="text-white">RISE Barbershop Dashboard</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Manage your appointments, schedules, and customer interactions efficiently.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-md border border-gray-800">
          <h2 className="text-2xl font-semibold mb-3 text-center">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "View Appointments", href: "/manage/barbershop/appointments", color: "bg-blue-600 hover:bg-blue-500" },
              { label: "Manage Barbers", href: "/manage/barbershop/barbers", color: "bg-yellow-500 hover:bg-yellow-400" },
              { label: "Update Services", href: "/manage/barbershop/services", color: "bg-green-600 hover:bg-green-500" },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <button className={`px-6 py-3 ${action.color} text-white rounded-md shadow-md transition-transform hover:scale-105`}>
                  {action.label}
                </button>
              </Link>
            ))}
          </div>
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

      </div>
    </div>
  );
}
