"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, Search } from "lucide-react";
import RightDrawer from "../reusable/RightDrawer";
import { Input } from "@/components/ui/input";
import { HaircutEventEventResponseDto } from "@/app/api/Api";
import { getHaircutEvents } from "@/services/haircuts";
import { getBarberServices } from "@/services/barber";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import BarberTable from "./BarberTable";
import AppointmentInfoPanel from "./AppointmentInfoPanel";
import AddAppointmentForm from "./AddAppointmentForm";
import { format, addDays } from "date-fns";
import { getAllStaffs } from "@/services/staff";
import Link from "next/link";
import { StaffRoleEnum, User } from "@/types/user";

export default function BarbershopPage({ staffs }: { staffs: User[] }) {
  // Regular state
  const [appointments, setAppointments] = useState<
    HaircutEventEventResponseDto[]
  >([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    HaircutEventEventResponseDto[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<HaircutEventEventResponseDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  // Add barbers state
  const [barbers, setBarbers] = useState<any[]>([]);

  // Stats for cards with default values
  const [stats, setStats] = useState({
    appointmentsThisWeek: 0,
    totalAppointments: 0,
    activeBarbers: 0,
    timeOffRequests: 0,
  });

  // Hooks
  const { toast } = useToast();
  const { user } = useUser();

  // Use refs to prevent infinite loops
  const isFirstRender = useRef(true);

  // Pre-compute permission checks once on render
  const isBarber = user?.Role === StaffRoleEnum.BARBER;
  const isSuperAdmin = user?.Role === StaffRoleEnum.SUPERADMIN;

  useEffect(() => {
    // Skip the effect on first render with a ref check
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const fetchData = async () => {
        try {
          setIsLoading(true);

          // Get today and 30 days in future for default date range
          const today = new Date();
          const thirtyDaysLater = addDays(today, 30);

          // Build query params
          const params: any = {
            after: format(today, "yyyy-MM-dd"),
            before: format(thirtyDaysLater, "yyyy-MM-dd"),
          };

          // If user is a barber and not admin, filter by their ID
          // if (isBarber && !isSuperAdmin && user?.ID) {
          //   params.barber_id = user.ID;
          // }

          // Fetch appointments
          const appointmentsData = await getHaircutEvents({
            ...params,
            // barber_id: isBarber && user.ID
          });
          setAppointments(appointmentsData);
          setFilteredAppointments(appointmentsData);

          // Calculate stats
          try {
            // Fetch barber services to get active barbers
            const barberServices = await getBarberServices();
            setServices(barberServices);

            // Get unique barber IDs
            const uniqueBarberIds = new Set(
              barberServices.map((service) => service.barber_id)
            );

            setStats({
              appointmentsThisWeek: appointmentsData.length,
              totalAppointments: appointmentsData.length,
              activeBarbers: uniqueBarberIds.size,
              timeOffRequests: 0,
            });
          } catch (serviceError) {
            console.error("Error fetching barber services:", serviceError);
            // Continue with partial data
          }
        } catch (error) {
          console.error("Error fetching barbershop data:", error);
          toast({
            status: "error",
            description: "Failed to load barbershop data",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user?.ID, toast, isBarber, isSuperAdmin]);

  // Filter appointments when search query changes - this is safe
  useEffect(() => {
    if (searchQuery) {
      // filter and make sure appointment is upcoming only

      const filtered = appointments.filter(
        (apt) =>
          apt.customer_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.barber_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchQuery, appointments]);

  // Functions that change state
  const handleAppointmentSelect = useCallback(
    (appointment: HaircutEventEventResponseDto) => {
      setSelectedAppointment(appointment);
      setDrawerContent("details");
      setDrawerOpen(true);
    },
    []
  );

  const handleAppointmentAdded = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get today and 30 days in future for default date range
      const today = new Date();
      const thirtyDaysLater = addDays(today, 30);

      // Build query params
      const params: any = {
        after: format(today, "yyyy-MM-dd"),
        before: format(thirtyDaysLater, "yyyy-MM-dd"),
      };

      // If user is a barber and not admin, filter by their ID
      if (isBarber && !isSuperAdmin && user?.ID) {
        params.barber_id = user.ID;
      }

      const refreshedAppointments = await getHaircutEvents(params);

      setAppointments(refreshedAppointments);
      setFilteredAppointments(refreshedAppointments);

      setDrawerOpen(false);
    } catch (error) {
      console.error("Error refreshing appointments:", error);
      toast({ status: "error", description: "Failed to refresh appointments" });
    } finally {
      setIsLoading(false);
    }
  }, [isBarber, isSuperAdmin, user?.ID, toast]);

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Barbershop"
          description="Manage appointments and barbers"
        />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Appointment
        </Button>
      </div>
      <Separator />

      {/* Quick Navigation - Fixed Links */}
      <div className="flex flex-wrap gap-4">
        {/* <Button variant="outline" asChild>
          <Link href="/manage/barbershop/appointments">View All Appointments</Link>
        </Button> */}
        <Button variant="outline" asChild>
          <Link href="/manage/barbershop/portfolio">Manage Portfolio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/manage/barbershop/barber-services">
            Manage Barber Services
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Appointments This Week
          </div>
          <div className="text-2xl font-bold">{stats.appointmentsThisWeek}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Appointments
          </div>
          <div className="text-2xl font-bold">{stats.totalAppointments}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Active Barbers
          </div>
          <div className="text-2xl font-bold">{stats.activeBarbers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Time Off Requests
          </div>
          <div className="text-2xl font-bold">{stats.timeOffRequests}</div>
        </div>
      </div>

      {/* Search and Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <BarberTable
          appointments={filteredAppointments}
          onAppointmentSelect={handleAppointmentSelect}
          isLoading={isLoading}
        />
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <RightDrawer
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          drawerWidth="w-[500px]"
        >
          <div className="p-4">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {drawerContent === "details"
                ? "Appointment Details"
                : "Add Appointment"}
            </h2>
            {drawerContent === "details" && selectedAppointment && (
              <AppointmentInfoPanel
                appointment={selectedAppointment}
                onAppointmentUpdated={handleAppointmentAdded}
              />
            )}
            {drawerContent === "add" && (
              <AddAppointmentForm
                onAppointmentAdded={handleAppointmentAdded}
                onCancel={() => setDrawerOpen(false)}
                services={services}
                barbers={barbers} // Pass the fetched barbers to the form
              />
            )}
          </div>
        </RightDrawer>
      )}
    </div>
  );
}
