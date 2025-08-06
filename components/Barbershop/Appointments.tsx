"use client";

import { useState, useEffect, useRef } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  PlusIcon,
  Search,
  Calendar as CalendarIcon,
  Filter,
  X,
  CalendarDays,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, isAfter, startOfDay } from "date-fns";
import { fromZonedISOString } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { HaircutEventEventResponseDto } from "@/app/api/Api";
import { getHaircutEvents, deleteHaircutEvent } from "@/services/haircuts";
import { getAllStaffs } from "@/services/staff";
import BarberTable from "./BarberTable";
import RightDrawer from "../reusable/RightDrawer";
import AppointmentInfoPanel from "./AppointmentInfoPanel";
import AddAppointmentForm from "./AddAppointmentForm";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCustomers } from "@/services/customer";
import { Customer } from "@/types/customer";
import { StaffRoleEnum } from "@/types/user";

type AppointmentView = "all" | "upcoming" | "completed";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<
    HaircutEventEventResponseDto[]
  >([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    HaircutEventEventResponseDto[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<HaircutEventEventResponseDto | null>(null);
  const [activeView, setActiveView] = useState<AppointmentView>("all");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter states
  const [selectedBarber, setSelectedBarber] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [barbers, setBarbers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();

  const isBarber = user?.Role === StaffRoleEnum.BARBER;
  const isSuperAdmin = user?.Role === StaffRoleEnum.SUPERADMIN;

  // Use ref to prevent multiple fetches on first render
  const isFirstFetch = useRef(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoadingCustomers(true);
        const customerData = await getCustomers();
        setCustomers(customerData.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  // Get initial barbers list for filter
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const allStaff = await getAllStaffs("BARBER");
        setBarbers(allStaff);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };

    fetchBarbers();
  }, []);

  // Check if any filters are active
  useEffect(() => {
    setHasActiveFilters(
      (selectedBarber && selectedBarber !== "all") ||
        (selectedCustomer && selectedCustomer !== "all") ||
        !!startDate ||
        !!endDate
    );
  }, [selectedBarber, selectedCustomer, startDate, endDate]);

  // Fetch appointments based on filters - Modified
  useEffect(() => {
    // Only fetch when filters change or on first render
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);

        // Build query params based on all filters
        const params: any = {};

        // Add date filters only if they are set
        if (startDate) {
          params.after = format(startDate, "yyyy-MM-dd");
        }

        if (endDate) {
          params.before = format(endDate, "yyyy-MM-dd");
        }

        if (selectedBarber && selectedBarber !== "all") {
          params.barber_id = selectedBarber;
        } else if (isBarber && !isSuperAdmin && user?.ID) {
          // If user is a barber and no barber is selected, default to current user
          params.barber_id = user.ID;
        }

        // Update the query params section in the fetchAppointments function:
        if (selectedCustomer && selectedCustomer !== "all") {
          params.customer_id = selectedCustomer;
        }

        console.log("Fetching with params:", params);

        // Fetch appointments with filters - add error handling
        try {
          const appointmentsData = await getHaircutEvents(params);

          // Sort appointments by date
          appointmentsData.sort((a, b) => {
            const dateA = fromZonedISOString(a.start_at || "");
            const dateB = fromZonedISOString(b.start_at || "");
            return dateA.getTime() - dateB.getTime();
          });

          setAppointments(appointmentsData);

          // Apply view filter (upcoming/completed)
          applyViewFilter(appointmentsData);
        } catch (apiError: any) {
          console.error("API error:", apiError);
          toast({
            status: "error",
            description: `Failed to load appointments: ${apiError.message}`,
          });
          setAppointments([]);
          setFilteredAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({ status: "error", description: "Failed to load appointments" });
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    // On first load, fetch with minimal params
    if (isFirstFetch.current) {
      isFirstFetch.current = false;

      // Just fetch based on user role without date filters
      const initialFetch = async () => {
        setIsLoading(true);
        try {
          const params: any = {};

          // Only filter by barber ID if user is a barber
          if (isBarber && !isSuperAdmin && user?.ID) {
            params.barber_id = user.ID;
          }

          const appointmentsData = await getHaircutEvents(params);
          setAppointments(appointmentsData);
          setFilteredAppointments(appointmentsData);
        } catch (error) {
          console.error("Initial fetch error:", error);
          toast({
            status: "error",
            description: "Failed to load appointments",
          });
          setAppointments([]);
          setFilteredAppointments([]);
        } finally {
          setIsLoading(false);
        }
      };

      initialFetch();
    } else {
      fetchAppointments();
    }
  }, [
    selectedBarber,
    selectedCustomer,
    startDate,
    endDate,
    isBarber,
    isSuperAdmin,
    user?.ID,
    toast,
  ]);

  const applyViewFilter = (appointmentsToFilter = appointments) => {
    if (activeView === "upcoming") {
      const upcoming = appointmentsToFilter.filter((apt) => {
        if (!apt.start_at) return false;
        const aptDate = fromZonedISOString(apt.start_at);
        const today = new Date();
        return aptDate >= today;
      });

      setFilteredAppointments(applySearchFilter(upcoming));
    } else if (activeView === "completed") {
      const completed = appointmentsToFilter.filter((apt) => {
        if (!apt.start_at) return false;
        const aptDate = fromZonedISOString(apt.start_at);
        const today = new Date();
        return aptDate < today;
      });

      setFilteredAppointments(applySearchFilter(completed));
    } else {
      setFilteredAppointments(applySearchFilter(appointmentsToFilter));
    }
  };

  // Apply search filter
  const applySearchFilter = (
    appointmentsToFilter: HaircutEventEventResponseDto[]
  ) => {
    if (!searchQuery) return appointmentsToFilter;

    return appointmentsToFilter.filter(
      (apt) =>
        apt.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.barber_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle view changes
  useEffect(() => {
    applyViewFilter();
  }, [activeView, appointments]);

  // Handle search query changes
  useEffect(() => {
    applyViewFilter();
  }, [searchQuery]);

  // Handle appointment selection
  const handleAppointmentSelect = (
    appointment: HaircutEventEventResponseDto
  ) => {
    setSelectedAppointment(appointment);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  // Handle appointment deletion
  const handleDeleteAppointment = async (id: string) => {
    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be logged in to delete appointments",
      });
      return;
    }

    try {
      await deleteHaircutEvent(id, user.Jwt);
      toast({
        status: "success",
        description: "Appointment deleted successfully",
      });

      // Remove from state
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      applyViewFilter(appointments.filter((apt) => apt.id !== id));

      // If deleted appointment is selected, close drawer
      if (selectedAppointment?.id === id) {
        setDrawerOpen(false);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({ status: "error", description: "Failed to delete appointment" });
    }
  };

  // Split the refresh functionality into a standalone function that can be called anywhere

  // Add this function to your component:
  const refreshAppointments = async (showSuccessToast = true) => {
    setIsLoading(true);
    try {
      // Build query params based on active filters
      const params: any = {};

      if (startDate) {
        params.after = format(startDate, "yyyy-MM-dd");
      }

      if (endDate) {
        params.before = format(endDate, "yyyy-MM-dd");
      }

      if (selectedBarber && selectedBarber !== "all") {
        params.barber_id = selectedBarber;
      } else if (isBarber && !isSuperAdmin && user?.ID) {
        params.barber_id = user.ID;
      }

      if (selectedCustomer && selectedCustomer !== "all") {
        params.customer_id = selectedCustomer;
      }

      console.log("Refreshing appointments with params:", params);

      const refreshedAppointments = await getHaircutEvents(params);
      setAppointments(refreshedAppointments);
      applyViewFilter(refreshedAppointments);

      if (showSuccessToast) {
        toast({ status: "success", description: "Appointments updated" });
      }
      return true;
    } catch (error) {
      console.error("Error refreshing appointments:", error);
      toast({
        status: "warning",
        description:
          "Could not refresh appointments list. Please try again or refresh the page.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentAdded = async () => {
    console.log("Appointment added callback triggered");

    // Close the drawer right away for better UX
    setDrawerOpen(false);

    // Show a loading toast
    toast({ status: "info", description: "Refreshing appointments..." });

    try {
      // Then refresh the list
      const success = await refreshAppointments(false);

      if (success) {
        toast({
          status: "success",
          description: "Appointment created and list refreshed",
        });
      } else {
        // If refresh failed but appointment was created
        toast({
          status: "warning",
          description:
            "Appointment created but couldn't refresh list. Please refresh manually.",
        });
      }
    } catch (error) {
      console.error("Error in handleAppointmentAdded:", error);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedBarber("all");
    setSelectedCustomer("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setFilterDrawerOpen(false);
  };

  // Get counts for different views
  const upcomingCount = appointments.filter((apt) => {
    const aptDate = fromZonedISOString(apt.start_at || "");
    const now = startOfDay(new Date());
    return (
      isAfter(aptDate, now) ||
      format(aptDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
    );
  }).length;

  const completedCount = appointments.filter((apt) => {
    const aptDate = fromZonedISOString(apt.start_at || "");
    const now = startOfDay(new Date());
    return (
      isBefore(aptDate, now) &&
      format(aptDate, "yyyy-MM-dd") !== format(now, "yyyy-MM-dd")
    );
  }).length;

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Appointments"
          description="Manage barber appointments"
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

      <Link href="/manage/barbershop">
        <Button variant="outline" className="mb-4">
          ← Back to Barbershop
        </Button>
      </Link>

      {/* View type filter cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card
          className={`bg-muted/20 ${activeView === "all" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveView("all")}
          role="button"
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-base font-medium">
              All Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{appointments.length}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeView === "upcoming" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveView("upcoming")}
          role="button"
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
              <CardTitle className="text-base font-medium">Upcoming</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{upcomingCount}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-muted/20 ${activeView === "completed" ? "ring-1 ring-primary/30" : ""} cursor-pointer hover:bg-muted/30 transition-colors`}
          onClick={() => setActiveView("completed")}
          role="button"
        >
          <CardHeader className="pb-1 pt-3 px-4">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-green-500" />
              <CardTitle className="text-base font-medium">Completed</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <p className="text-xl font-bold">{completedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-1 bg-primary h-5 w-5 p-0 flex items-center justify-center">
                    <span className="sr-only">Active filters</span>✓
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[340px]">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 text-xs"
                  >
                    Reset All
                  </Button>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Start Date
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate
                              ? format(startDate, "PPP")
                              : "No start date selected"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        End Date
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate
                              ? format(endDate, "PPP")
                              : "No end date selected"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={(date) =>
                              startDate ? date < startDate : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Barber</label>
                  <Select
                    value={selectedBarber}
                    onValueChange={setSelectedBarber}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All barbers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All barbers</SelectItem>
                      {barbers.map((barber) => (
                        <SelectItem key={barber.ID} value={barber.ID}>
                          {barber.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Customer</label>
                  <Select
                    value={selectedCustomer}
                    onValueChange={setSelectedCustomer}
                    disabled={isLoadingCustomers}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingCustomers
                            ? "Loading customers..."
                            : "All customers"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All customers</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {`${customer.first_name} ${customer.last_name}`} (
                          {customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    className="w-full"
                    onClick={() => setFilterDrawerOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10 text-xs flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {startDate && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              From: {format(startDate, "MMM dd, yyyy")}
            </Badge>
          )}
          {endDate && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              To: {format(endDate, "MMM dd, yyyy")}
            </Badge>
          )}
          {selectedBarber && barbers.find((b) => b.ID === selectedBarber) && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Barber: {barbers.find((b) => b.ID === selectedBarber)?.Name}
            </Badge>
          )}

          {selectedCustomer && selectedCustomer !== "all" && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Customer:{" "}
              {(() => {
                const customer = customers.find(
                  (c) => c.id === selectedCustomer
                );
                return customer
                  ? `${customer.first_name} ${customer.last_name}`
                  : selectedCustomer;
              })()}
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      <div className="mt-4">
        <BarberTable
          appointments={filteredAppointments}
          onAppointmentSelect={handleAppointmentSelect}
          onDeleteAppointment={handleDeleteAppointment}
          isLoading={isLoading}
        />
      </div>

      {/* Drawer - Only render when open */}
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
                services={[]}
                barbers={barbers} // Pass the barbers that are already fetched
              />
            )}
          </div>
        </RightDrawer>
      )}
    </div>
  );
}
