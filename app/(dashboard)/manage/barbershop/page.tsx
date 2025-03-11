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
    { id: 1, customer: "John Doe", date: "2024-03-10", status: "Upcoming" },
    { id: 2, customer: "Jane Smith", date: "2024-03-05", status: "Completed" },
    { id: 3, customer: "Mike Johnson", date: "2024-03-02", status: "Cancelled" },
    { id: 4, customer: "Sarah Lee", date: "2024-03-12", status: "Upcoming" },
    { id: 5, customer: "Tom Brown", date: "2024-03-07", status: "Completed" },
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newCustomer, setNewCustomer] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");
  const [newStatus, setNewStatus] = useState<"Upcoming" | "Completed" | "Cancelled">("Upcoming");

  const [showEditModal, setShowEditModal] = useState(false);

  // Handle Edit button click
  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewCustomer(appointment.customer);
    setNewDate(appointment.date);
    setNewStatus(appointment.status);
    setShowEditModal(true);
  };

  // Handle saving the changes in the modal
  const handleSaveChanges = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((appt) =>
        appt.id === selectedAppointment.id
          ? { ...appt, customer: newCustomer, date: newDate, status: newStatus }
          : appt
      );
      setAppointments(updatedAppointments);
      setShowEditModal(false);
    }
  };

  // Handle delete appointment
  const handleDelete = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.filter((appt) => appt.id !== selectedAppointment.id);
      setAppointments(updatedAppointments);
      setShowEditModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 px-6">
      <div className="w-full max-w-7xl space-y-6">

        {/* Header + Quick Actions Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-xl border border-gray-800">
          <h1 className="text-4xl font-bold flex items-center gap-3 justify-center">
            <span className="text-white">RISE Barbershop</span>
          </h1>
          <p className="text-gray-400 text-lg text-center mt-2">
            Manage your appointments, control your availability, update your portfolio, and stay on top of your schedule!
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {[ 
              { label: "View All Appointments", href: "/manage/barbershop/appointments", color: "bg-blue-600 hover:bg-blue-500" },
              { label: "Manage Portfolio", href: "/manage/barbershop/portfolio", color: "bg-purple-600 hover:bg-purple-500" },
              { label: "Manage Barbers", href: "/manage/barbershop/manage-barbers", color: "bg-yellow-500 hover:bg-yellow-400" },
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
            { title: "Appointments This Week", value: "5", icon: "📅", color: "text-yellow-400" },
            { title: "Total Appointments", value: "135", icon: "📅", color: "text-yellow-400" },
            { title: "Active Barbers", value: "8", icon: "✂️", color: "text-green-400" },
            { title: "Time Off Requests", value: "2", icon: "🛑", color: "text-red-400" },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-950 p-6 rounded-lg shadow-md border border-gray-800 transition-transform hover:scale-105 hover:shadow-lg">
              <h3 className="text-md text-gray-400 flex items-center gap-2">{stat.icon} {stat.title}</h3>
              <p className={`text-4xl font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Appointments Table Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-md border border-gray-800">
          <h2 className="text-2xl font-semibold mb-3 flex justify-between items-center">
            Recent Appointments
            <Link href="/manage/barbershop/appointments">
              <button className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm">
                View More
              </button>
            </Link>
          </h2>
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
                    <th className="text-left p-3 text-gray-400">Actions</th>
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
                      <td className="p-3">
                        <button
                          onClick={() => handleEditClick(appt)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Edit Appointment Modal */}
        {showEditModal && selectedAppointment && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-gray-950 p-6 rounded-xl shadow-xl border border-gray-800 w-96">
              <h2 className="text-2xl font-semibold text-white mb-4">Edit Appointment</h2>

              <div className="mb-4">
                <label className="text-gray-300">Customer</label>
                <input
                  type="text"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-300">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-300">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "Upcoming" | "Completed" | "Cancelled")}
                  className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm"
                >
                  Save Changes
                </button>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowEditModal(false)}
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
