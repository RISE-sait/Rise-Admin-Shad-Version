"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { HaircutEventRequestDto } from "@/app/api/Api";
import { createHaircutEvent } from "@/services/haircuts";
import { format, addHours } from "date-fns";
import { toZonedISOString } from "@/lib/utils";
import { getCustomers } from "@/services/customer";
import { Customer } from "@/types/customer";
import { StaffRoleEnum } from "@/types/user";
import { Scissors, Calendar, User } from "lucide-react";

interface AddAppointmentFormProps {
  onAppointmentAdded: () => void;
  onCancel: () => void;
  services?: any[];
  barbers?: any[];
}

export default function AddAppointmentForm({
  onAppointmentAdded,
  onCancel,
  services = [],
  barbers: propBarbers = [],
}: AddAppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  // Default date (now) and time (now + 1 hour) in local format
  const now = new Date();
  const defaultDate = format(now, "yyyy-MM-dd");
  const defaultTime = format(now, "HH:mm");
  const defaultEndTime = format(addHours(now, 1), "HH:mm");

  const [formData, setFormData] = useState<{
    barber_id: string;
    customer_id: string;
    customer_name: string;
    date: string;
    time: string;
    endTime: string;
    service_name: string;
  }>({
    barber_id: "",
    customer_id: "",
    customer_name: "",
    date: defaultDate,
    time: defaultTime,
    endTime: defaultEndTime,
    service_name: "Regular Haircut",
  });

  const [availableBarbers, setAvailableBarbers] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Fetch customers - only once
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoadingCustomers(true);
        const customerData = await getCustomers();
        setCustomers(customerData.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({ status: "error", description: "Failed to load customers" });
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []); // Remove toast from dependencies to prevent unnecessary re-runs

  // Set barbers just once when the component mounts or props change
  useEffect(() => {
    if (propBarbers && propBarbers.length > 0) {
      // Simple one-time mapping without complex comparisons
      const mappedBarbers = propBarbers.map((barber) => ({
        id: barber.ID || barber.id,
        name: barber.Name || barber.name,
      }));
      setAvailableBarbers(mappedBarbers);
    } else if (services && services.length > 0) {
      // Extract unique barbers from services
      const uniqueBarbers = new Map();
      services.forEach((service) => {
        if (service.barber_id && service.barber_name) {
          uniqueBarbers.set(service.barber_id, {
            id: service.barber_id,
            name: service.barber_name,
          });
        }
      });

      const newBarbers = Array.from(uniqueBarbers.values());
      setAvailableBarbers(newBarbers);
    }
  }, [propBarbers, services]); // Only run when these props change

  // Set barber ID from user in a separate effect
  useEffect(() => {
    if (
      user?.ID &&
      user?.Role === StaffRoleEnum.BARBER &&
      formData.barber_id === ""
    ) {
      setFormData((prev) => ({
        ...prev,
        barber_id: user.ID,
      }));
    }
  }, [user]); // Only run when user changes

  // Fix customer name update to prevent infinite loop
  useEffect(() => {
    if (formData.customer_id && customers.length > 0) {
      const selectedCustomer = customers.find(
        (c) => c.id === formData.customer_id
      );
      if (selectedCustomer) {
        const fullName = `${selectedCustomer.first_name} ${selectedCustomer.last_name}`;
        // Only update if the name actually changed
        if (formData.customer_name !== fullName) {
          setFormData((prev) => ({
            ...prev,
            customer_name: fullName,
          }));
        }
      }
    }
  }, [formData.customer_id, customers]); // Don't include formData.customer_name in dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customer_id) {
      toast({ status: "error", description: "Please select a customer" });
      return;
    }

    if (!formData.barber_id) {
      toast({ status: "error", description: "Please select a barber" });
      return;
    }

    if (!formData.date || !formData.time || !formData.endTime) {
      toast({
        status: "error",
        description: "Please select a valid date and time",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create ISO date strings from form data
      const startDateTime = toZonedISOString(
        new Date(`${formData.date}T${formData.time}`)
      );
      const endDateTime = toZonedISOString(
        new Date(`${formData.date}T${formData.endTime}`)
      );

      // Create request DTO
      const appointmentData: HaircutEventRequestDto = {
        barber_id: formData.barber_id,
        begin_time: startDateTime,
        end_time: endDateTime,
        service_name: formData.service_name,
      };

      if (!user?.Jwt) {
        toast({
          status: "error",
          description: "You must be logged in to create an appointment",
        });
        return;
      }

      await createHaircutEvent(appointmentData, user.Jwt);
      toast({
        status: "success",
        description: "Appointment created successfully",
      });
      onAppointmentAdded();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({ status: "error", description: "Failed to create appointment" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-3">
      {/* Appointment Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Appointment Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Customer <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, customer_id: value }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={
                      isLoadingCustomers ? "Loading customers..." : "Select customer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {`${customer.first_name} ${customer.last_name}`} (
                      {customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Barber <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.barber_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, barber_id: value }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select barber" />
                </SelectTrigger>
                <SelectContent>
                  {availableBarbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Service <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.service_name}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, service_name: value }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular Haircut">Regular Haircut</SelectItem>
                  <SelectItem value="Buzz">Buzz</SelectItem>
                  <SelectItem value="Razor">Razor</SelectItem>
                  <SelectItem value="Beard Trim">Beard Trim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Schedule</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                required
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                  required
                  className="bg-background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Scissors className="h-5 w-5 mr-2" />
          {isLoading ? "Creating..." : "Create Appointment"}
        </Button>
      </div>
    </form>
  );
}
