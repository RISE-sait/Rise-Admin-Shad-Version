"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { HaircutServiceCreateBarberServiceRequestDto } from "@/app/api/Api";
import { createBarberService, getBarberServices } from "@/services/barber";
import { StaffRoleEnum } from "@/types/user";

interface AddBarberServiceFormProps {
  onServiceAdded: () => void;
  onCancel: () => void;
  barbers: any[];
}

interface ServiceTypeOption {
  id: string;
  name: string;
}

export default function AddBarberServiceForm({
  onServiceAdded,
  onCancel,
  barbers,
}: AddBarberServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();

  // Available service types extracted from existing barber services
  const [availableServices, setAvailableServices] = useState<
    ServiceTypeOption[]
  >([]);

  const [formData, setFormData] = useState<{
    barber_id: string;
    haircut_service_id: string;
  }>({
    barber_id: "",
    haircut_service_id: "",
  });

  // Extract unique service types from barber services
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setLoadingServices(true);
      try {
        // Get all existing barber services
        const barberServices = await getBarberServices();

        // Extract unique service types by service_type_id
        const uniqueServices = new Map<string, ServiceTypeOption>();

        barberServices.forEach((service) => {
          if (service.haircut_id && !uniqueServices.has(service.haircut_id)) {
            uniqueServices.set(service.haircut_id, {
              id: service.haircut_id,
              name: service.haircut_name || "Unknown Service",
            });
          }
        });

        // Convert Map to array
        const serviceOptions = Array.from(uniqueServices.values());
        setAvailableServices(serviceOptions);
      } catch (error) {
        console.error("Error fetching service types:", error);
        toast({ status: "error", description: "Failed to load service types" });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServiceTypes();
  }, [toast]);

  // If user is a barber, preselect them
  useEffect(() => {
    if (user?.Role === StaffRoleEnum.BARBER && user?.ID) {
      setFormData((prev) => ({ ...prev, barber_id: user.ID }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.barber_id) {
      toast({ status: "error", description: "Please select a barber" });
      return;
    }

    if (!formData.haircut_service_id) {
      toast({ status: "error", description: "Please select a service" });
      return;
    }

    setIsLoading(true);

    try {
      if (!user?.Jwt) {
        toast({
          status: "error",
          description: "You must be logged in to add services",
        });
        return;
      }

      // Create the request DTO
      const serviceData: HaircutServiceCreateBarberServiceRequestDto = {
        barber_id: formData.barber_id,
        haircut_service_id: formData.haircut_service_id,
      };

      // Call the API
      await createBarberService(serviceData, user.Jwt);

      toast({
        status: "success",
        description: "Barber service added successfully",
      });
      onServiceAdded();
    } catch (error) {
      console.error("Error adding barber service:", error);
      toast({ status: "error", description: "Failed to add barber service" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          Barber <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.barber_id}
          onValueChange={(value) =>
            setFormData(prev => ({ ...prev, barber_id: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select barber" />
          </SelectTrigger>
          <SelectContent>
            {barbers.map((barber) => (
              <SelectItem key={barber.ID} value={barber.ID}>
                {barber.Name}
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
          value={formData.haircut_service_id}
          onValueChange={(value) =>
            setFormData(prev => ({ ...prev, haircut_service_id: value }))
          }
          disabled={loadingServices}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                loadingServices ? "Loading services..." : "Select service"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {availableServices.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {availableServices.length === 0 && !loadingServices && (
          <p className="text-sm text-orange-500 mt-1">
            No available services found. A barber must offer services before
            they can be assigned.
          </p>
        )}
      </div>

      <div className="flex space-x-4 pt-4">
        <Button
          type="submit"
          disabled={
            isLoading || loadingServices || availableServices.length === 0
          }
          className="flex-1"
        >
          {isLoading ? "Adding..." : "Add Service"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
