"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Appointment = {
  id: number;
  customer: string;
  date: string;
  status: "Upcoming" | "Completed" | "Cancelled";
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, customer: "John Doe", date: "2024-03-10", status: "Upcoming" },
    { id: 2, customer: "Jane Smith", date: "2024-03-05", status: "Completed" },
    { id: 3, customer: "Mike Johnson", date: "2024-03-02", status: "Cancelled" },
    { id: 4, customer: "Sarah Lee", date: "2024-03-12", status: "Upcoming" },
    { id: 5, customer: "Tom Brown", date: "2024-03-07", status: "Completed" },
  ]);

  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [upcomingThisWeek, setUpcomingThisWeek] = useState<number>(0);
  const [completedThisMonth, setCompletedThisMonth] = useState<number>(0);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newCustomer, setNewCustomer] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newStatus, setNewStatus] = useState<"Upcoming" | "Completed" | "Cancelled">("Upcoming");

  useEffect(() => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const upcomingAppointments = appointments.filter((appt) => {
      const appointmentDate = new Date(appt.date);
      return appt.status === "Upcoming" && appointmentDate >= startOfWeek && appointmentDate <= currentDate;
    });
    setUpcomingThisWeek(upcomingAppointments.length);

    const completedAppointments = appointments.filter((appt) => {
      const appointmentDate = new Date(appt.date);
      return appt.status === "Completed" && appointmentDate >= startOfMonth;
    });
    setCompletedThisMonth(completedAppointments.length);
  }, [appointments]);

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter((appt) => appt.status === status));
    }
  };

  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewCustomer(appointment.customer);
    setNewDate(appointment.date);
    setNewStatus(appointment.status);
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((appt) =>
        appt.id === selectedAppointment.id
          ? { ...appt, customer: newCustomer, date: newDate, status: newStatus }
          : appt
      );
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      setShowEditModal(false);
    }
  };

  const handleDelete = (appointmentId: number) => {
    const updatedAppointments = appointments.filter((appt) => appt.id !== appointmentId);
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
    setShowEditModal(false);
  };

  const handleCreateNewAppointment = () => {
    const newId = appointments.length + 1;
    const newAppointment = {
      id: newId,
      customer: newCustomer,
      date: newDate,
      status: newStatus,
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
    setShowCreateModal(false);
    
    // Clear input fields
    setNewCustomer("");
    setNewDate("");
    setNewStatus("Upcoming");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 px-6">
      <div className="w-full max-w-7xl space-y-6">
        {/* Back Button */}
        <div className="mb-2">
          <Link href="/manage/barbershop">
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md text-sm">
              ← Back to Barbershop
            </button>
          </Link>
        </div>

        {/* Title Section */}
        <div className="bg-gray-950 p-6 rounded-xl shadow-xl border border-gray-800 text-center">
          <h1 className="text-3xl font-bold text-white">📊 Manage Appointments</h1>
          <p className="text-gray-400 text-lg mt-2">
            Manage your appointments, schedules, and customer interactions efficiently.
          </p>
        </div>

        {/* Filter Section in a card */}
        <div className="bg-gray-950 p-6 rounded-xl shadow-md border border-gray-800 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-semibold text-white">Filter Appointments</div>
            <select
              onChange={(e) => handleFilterChange(e.target.value)}
              value={statusFilter}
              className="px-4 py-2 bg-gray-800 text-white rounded-md"
            >
              <option value="All">All</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-950 p-6 rounded-xl shadow-md border border-gray-800">
              <h3 className="text-xl font-semibold text-white">Upcoming This Week</h3>
              <p className="text-2xl text-blue-400">{upcomingThisWeek} appointments</p>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl shadow-md border border-gray-800">
              <h3 className="text-xl font-semibold text-white">Completed This Month</h3>
              <p className="text-2xl text-green-400">{completedThisMonth} appointments</p>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl shadow-md border border-gray-800">
              <h3 className="text-xl font-semibold text-white">Cancelled Appointments</h3>
              <p className="text-2xl text-red-400">
                {appointments.filter((appt) => appt.status === "Cancelled").length} appointments
              </p>
            </div>
          </div>
        </div>

        {/* Create New Appointment Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-4 bg-green-500 hover:bg-green-400 text-white rounded-md text-lg font-bold"
          >
            + Add New Appointment
          </button>
        </div>

        {/* Appointments Table Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-md border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Appointments</h2>
            <select
              onChange={(e) => handleFilterChange(e.target.value)}
              value={statusFilter}
              className="px-4 py-2 bg-gray-800 text-white rounded-md"
            >
              <option value="All">Filter</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mt-4 border p-4 rounded-lg bg-gray-900">
            {filteredAppointments.length === 0 ? (
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
                  {filteredAppointments.map((appt) => (
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
                      <td className="p-3 flex gap-4">
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

        {/* Edit Modal */}
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
                <button
                  onClick={() => handleDelete(selectedAppointment.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm"
                >
                  Delete
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

        {/* Create New Appointment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-gray-950 p-6 rounded-xl shadow-xl border border-gray-800 w-96">
              <h2 className="text-2xl font-semibold text-white mb-4">Create New Appointment</h2>

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
                  onClick={handleCreateNewAppointment}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
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