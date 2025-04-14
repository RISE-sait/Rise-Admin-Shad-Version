"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const mockAppointments = [
  { id: 1, customer: "John Doe", barber: "Alen Reni Thomas", date: "2024-03-10", status: "Upcoming" },
  { id: 2, customer: "Jane Smith", barber: "LeBron James", date: "2024-03-05", status: "Completed" },
  { id: 3, customer: "Mike Johnson", barber: "Charlie Green", date: "2024-03-02", status: "Cancelled" },
];

export default function BarbershopPage() {
  const [appointments] = useState(mockAppointments);
  const buttonLinks = [
    { text: "View Appointments", href: "/manage/barbershop/appointments" },
    { text: "Manage Portfolio", href: "/manage/barbershop/portfolio" },
    { text: "Manage Barbers", href: "/manage/barbershop/manage-barbers" }
  ];

  const stats = [
    { title: "Appointments This Week", value: "5" },
    { title: "Total Appointments", value: "135" },
    { title: "Active Barbers", value: "8" },
    { title: "Time Off Requests", value: "2" }
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Upcoming": return "bg-blue-600/20 text-blue-400";
      case "Completed": return "bg-green-600/20 text-green-400";
      default: return "bg-red-600/20 text-red-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Barbershop</h2>
        <p className="text-gray-400">Manage appointments and barbers</p>
      </div>

      <div className="flex gap-4">
        {buttonLinks.map((link, index) => (
          <Button key={index} asChild className="bg-black text-white hover:bg-yellow-500 hover:text-black border border-gray-700">
            <Link href={link.href}>{link.text}</Link>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer <ArrowUpDown className="ml-2" /></TableHead>
                <TableHead>Barber</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map(appt => (
                <TableRow key={appt.id} className="hover:bg-gray-100">
                  <TableCell className="text-gray-400">{appt.customer}</TableCell>
                  <TableCell className="text-gray-400">{appt.barber}</TableCell>
                  <TableCell className="text-gray-400">{appt.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-3 py-1 rounded-md ${getStatusStyle(appt.status)}`}>
                      {appt.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button className="bg-black text-white hover:bg-yellow-500">
                          <MoreHorizontal />
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