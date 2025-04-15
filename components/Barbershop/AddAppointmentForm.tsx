"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { HaircutRequestDto } from "@/app/api/Api";
import { createHaircutEvent } from "@/services/haircuts";
import { format, addHours } from "date-fns";
import { getAllCustomers } from "@/services/customer";
import { Customer } from "@/types/customer";
import { StaffRoleEnum } from "@/types/user";

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
  barbers: propBarbers = []
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
    service_name: "Regular Haircut"
  });

  const [availableBarbers, setAvailableBarbers] = useState<Array<{id: string, name: string}>>([]);
  
  // Fetch customers - only once
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoadingCustomers(true);
        const customerData = await getAllCustomers();
        setCustomers(customerData);
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
      const mappedBarbers = propBarbers.map(barber => ({
        id: barber.ID || barber.id,
        name: barber.Name || barber.name
      }));
      setAvailableBarbers(mappedBarbers);
    }
    else if (services && services.length > 0) {
      // Extract unique barbers from services
      const uniqueBarbers = new Map();
      services.forEach(service => {
        if (service.barber_id && service.barber_name) {
          uniqueBarbers.set(service.barber_id, {
            id: service.barber_id,
            name: service.barber_name
          });
        }
      });
      
      const newBarbers = Array.from(uniqueBarbers.values());
      setAvailableBarbers(newBarbers);
    }
  }, [propBarbers, services]); // Only run when these props change
  
  // Set barber ID from user in a separate effect
  useEffect(() => {
    if (user?.ID && user?.Role === StaffRoleEnum.BARBER && formData.barber_id === "") {
      setFormData(prev => ({
        ...prev,
        barber_id: user.ID
      }));
    }
  }, [user]); // Only run when user changes

  // Fix customer name update to prevent infinite loop
  useEffect(() => {
    if (formData.customer_id && customers.length > 0) {
      const selectedCustomer = customers.find(c => c.id === formData.customer_id);
      if (selectedCustomer) {
        const fullName = `${selectedCustomer.first_name} ${selectedCustomer.last_name}`;
        // Only update if the name actually changed
        if (formData.customer_name !== fullName) {
          setFormData(prev => ({
            ...prev,
            customer_name: fullName
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
      toast({ status: "error", description: "Please select a valid date and time" });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create ISO date strings from form data
      const startDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`).toISOString();
      
      // Create request DTO
      const appointmentData: HaircutRequestDto = {
        barber_id: formData.barber_id,
        begin_time: startDateTime,
        end_time: endDateTime,
        service_name: formData.service_name
      };
      
      if (!user?.Jwt) {
        toast({ status: "error", description: "You must be logged in to create an appointment" });
        return;
      }
      
      await createHaircutEvent(appointmentData, user.Jwt);
      toast({ status: "success", description: "Appointment created successfully" });
      onAppointmentAdded();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({ status: "error", description: "Failed to create appointment" });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          Customer <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.customer_id}
          onValueChange={(value) => setFormData(prev => ({...prev, customer_id: value}))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoadingCustomers ? "Loading customers..." : "Select customer"} />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {`${customer.first_name} ${customer.last_name}`} ({customer.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Barber <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.barber_id}
          onValueChange={(value) => setFormData(prev => ({...prev, barber_id: value}))}
        >
          <SelectTrigger>
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
      
      <div>
        <label className="block text-sm font-medium mb-1">
            Service <span className="text-red-500">*</span>
        </label>
        <Select
            value={formData.service_name}
            onValueChange={(value) => setFormData(prev => ({...prev, service_name: value}))}
        >
            <SelectTrigger>
            <SelectValue />
            </SelectTrigger>
            <SelectContent>
            {/* Update these options to match the available services */}
            <SelectItem value="Regular Haircut">Regular Haircut</SelectItem>
            <SelectItem value="Buzz">Buzz</SelectItem>
            <SelectItem value="Razor">Razor</SelectItem>
            <SelectItem value="Beard Trim">Beard Trim</SelectItem>
            </SelectContent>
        </Select>
        </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Date <span className="text-red-500">*</span>
        </label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            End Time <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData(prev => ({...prev, endTime: e.target.value}))}
            required
          />
        </div>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Appointment"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}