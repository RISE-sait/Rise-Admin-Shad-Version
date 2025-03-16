"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Updated Fake Appointment Data
const mockAppointments = [
  { id: 1, customer: "John Doe", barber: "Alen Reni Thomas", date: "2024-03-10", status: "Upcoming" },
  { id: 2, customer: "Jane Smith", barber: "LeBron James", date: "2024-03-05", status: "Completed" },
  { id: 3, customer: "Mike Johnson", barber: "Charlie Green", date: "2024-03-02", status: "Cancelled" },
  { id: 4, customer: "Sarah Lee", barber: "David Brown", date: "2024-03-12", status: "Upcoming" },
  { id: 5, customer: "Tom Brown", barber: "Ethan Clark", date: "2024-03-07", status: "Completed" },
];

export default function BarbershopPage() {
  const [appointments, setAppointments] = useState(mockAppointments);

  return (
    <div className="p-6 space-y-6">
      {/* Simple Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Barbershop</h2>
        <p className="text-muted-foreground">
          Manage your appointments, control availability, and update your portfolio.
        </p>
      </div>

      {/* Action Buttons - Styled with Subtle Gray Border */}
      <div className="flex gap-4">
        <Button asChild className="bg-black text-white px-6 py-3 rounded-md border border-gray-700 font-medium transition-all duration-300 ease-in-out hover:bg-yellow-500 hover:text-black hover:border-yellow-500">
          <Link href="/manage/barbershop/appointments">View Appointments</Link>
        </Button>
        <Button asChild className="bg-black text-white px-6 py-3 rounded-md border border-gray-700 font-medium transition-all duration-300 ease-in-out hover:bg-yellow-500 hover:text-black hover:border-yellow-500">
          <Link href="/manage/barbershop/portfolio">Manage Portfolio</Link>
        </Button>
        <Button asChild className="bg-black text-white px-6 py-3 rounded-md border border-gray-700 font-medium transition-all duration-300 ease-in-out hover:bg-yellow-500 hover:text-black hover:border-yellow-500">
          <Link href="/manage/barbershop/manage-barbers">Manage Barbers</Link>
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Appointments This Week", value: "5" },
          { title: "Total Appointments", value: "135" },
          { title: "Active Barbers", value: "8" },
          { title: "Time Off Requests", value: "2" },
        ].map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border">
            <Table className="border-collapse">
              <TableHeader className="bg-muted/100 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-left">
                    <Button variant="ghost" className="font-medium hover:bg-accent hover:text-accent-foreground">
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
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appt) => (
                    <TableRow key={appt.id} className="border-b hover:bg-muted/50 transition">
                      <TableCell className="text-gray-400">{appt.customer}</TableCell> {/* Updated to match barber styling */}
                      <TableCell className="text-gray-400">{appt.barber}</TableCell>
                      <TableCell className="text-gray-400">{appt.date}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-md 
                            ${
                              appt.status === "Upcoming"
                                ? "bg-blue-600/20 text-blue-400"
                                : appt.status === "Completed"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                        >
                          {appt.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="h-8 w-8 p-0 bg-black text-white rounded-md border border-gray-700 transition-all duration-300 ease-in-out hover:bg-yellow-500 hover:text-black hover:border-yellow-500">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
