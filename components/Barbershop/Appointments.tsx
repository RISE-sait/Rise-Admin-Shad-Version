"use client";
import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpDown, MoreHorizontal, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const initialAppointments = [
  { id: 1, customer: "John Doe", barber: "Alen Reni Thomas", date: "2024-03-10", status: "Upcoming" },
  { id: 2, customer: "Jane Smith", barber: "LeBron James", date: "2024-03-05", status: "Completed" },
  { id: 3, customer: "Mike Johnson", barber: "Charlie Green", date: "2024-03-02", status: "Cancelled" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customer: "", barber: "Alen Reni Thomas", date: "" });

  // Count appointments by status
  const countUpcoming = appointments.filter(appt => appt.status === "Upcoming").length;
  const countCompleted = appointments.filter(appt => appt.status === "Completed").length;
  const countCancelled = appointments.filter(appt => appt.status === "Cancelled").length;

  function addAppointment() {
    if (!formData.customer || !formData.date) {
      alert("Please fill in all fields");
      return;
    }

    const newAppt = {
      id: appointments.length + 1,
      ...formData,
      status: "Upcoming" as const
    };

    setAppointments([...appointments, newAppt]);
    setShowForm(false);
    setFormData({ customer: "", barber: "Alen Reni Thomas", date: "" });
  }

  return (
    <div className="p-6 space-y-6">
      {/* Original Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Appointments</h2>
        <p className="text-muted-foreground">
          Track and manage all customer appointments efficiently.
        </p>
      </div>

      {/* Original Back Button */}
      <Link href="/manage/barbershop">
        <Button className="bg-black text-white px-6 py-3 hover:bg-yellow-500 hover:text-black border border-gray-700">
          ← Back to Barbershop
        </Button>
      </Link>

      {/* Original Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-blue-400">{countUpcoming}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-green-400">{countCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cancelled Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-red-400">{countCancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-black text-white px-6 py-3 hover:bg-yellow-500 hover:text-black"
        >
          + Add Appointment
        </Button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96 border border-gray-700">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Add Appointment</h2>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </Button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Customer Name"
                className="w-full p-3 bg-gray-800 rounded-md border border-gray-600 text-white"
                value={formData.customer}
                onChange={e => setFormData({...formData, customer: e.target.value})}
              />
              <select
                className="w-full p-3 bg-gray-800 rounded-md border border-gray-600 text-white"
                value={formData.barber}
                onChange={e => setFormData({...formData, barber: e.target.value})}
              >
                <option>Alen Reni Thomas</option>
                <option>LeBron James</option>
              </select>
              <input
                type="date"
                className="w-full p-3 bg-gray-800 rounded-md border border-gray-600 text-white"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <Button 
              className="w-full mt-6 bg-yellow-500 text-black hover:bg-yellow-400"
              onClick={addAppointment}
            >
              Add Appointment
            </Button>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">
                  <Button variant="ghost">
                    Customer <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Barber</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map(appt => (
                <TableRow key={appt.id}>
                  <TableCell className="text-gray-400">{appt.customer}</TableCell>
                  <TableCell className="text-gray-400">{appt.barber}</TableCell>
                  <TableCell className="text-gray-400">{appt.date}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 text-xs rounded-md ${
                      appt.status === "Upcoming" ? "bg-blue-600/20 text-blue-400" :
                      appt.status === "Completed" ? "bg-green-600/20 text-green-400" :
                      "bg-red-600/20 text-red-400"
                    }`}>
                      {appt.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button className="bg-black text-white hover:bg-yellow-500">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}