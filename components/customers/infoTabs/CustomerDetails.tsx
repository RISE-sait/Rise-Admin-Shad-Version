"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import { CustomerStatsUpdateRequestDto } from "@/app/api/Api";
import { useToast } from "@/hooks/use-toast"
import { getCustomerById } from "@/services/customer";
import { useUser } from "@/contexts/UserContext";

export default function DetailsTab({ customer, onCustomerUpdated }: {
  customer: Customer;
  onCustomerUpdated?: () => void;
}) {

  const { toast } = useToast()
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [formData, setFormData] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: customer.phone || "",
  });

  // Initialize with default values
  const [athleteStats, setAthleteStats] = useState<CustomerStatsUpdateRequestDto>({
    wins: 0,
    losses: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
  });

  // Fetch athlete stats when component mounts
  useEffect(() => {
    // Only fetch if we have a customer ID
    if (customer.id) {
      const fetchAthleteStats = async () => {
        setIsLoadingStats(true);
        try {
          const statsData = await getCustomerById(customer.id!);
          setAthleteStats({
            wins: statsData.wins || 0,
            losses: statsData.losses || 0,
            points: statsData.points || 0,
            rebounds: statsData.rebounds || 0,
            assists: statsData.assists || 0,
            steals: statsData.steals || 0,
          });
        } catch (error) {
          console.error("Error fetching athlete stats:", error);
          toast({ status: "error", description: "Could not load athlete statistics" });
        } finally {
          setIsLoadingStats(false);
        }
      };

      fetchAthleteStats();
    }
  }, [customer.id]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatsChange = (field: string, value: number) => {
    setAthleteStats((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleUpdateCustomer = async () => {
  //   // Validation
  //   if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
  //     toast({ status: "error", description: "Name and email are required fields" });
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     // Note: Since there's no direct endpoint for updating customer general info,
  //     // we'll just update the athlete stats for now

  //     if (!user?.Jwt) {
  //       toast({ status: "error", description: "User JWT is missing" });
  //       return
  //     }

  //     if (customer.id) {
  //       await updateCustomerStats(customer.id, athleteStats, user?.Jwt);

  //       toast({ status: "success", description: "Customer statistics updated successfully" });

  //       if (onCustomerUpdated) {
  //         onCustomerUpdated();
  //       }
  //     } else {
  //       toast({ status: "error", description: "Customer ID is missing" });
  //     }
  //   } catch (error) {
  //     console.error("Error updating customer:", error);
  //     toast({ status: "error", description: "Failed to update customer information" });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-1">
              First Name <span className="text-red-500"></span>
            </label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              disabled
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-1">
              Last Name <span className="text-red-500"></span>
            </label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              disabled
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-red-500"></span>
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled
          />
        </div>
      </div>

      {customer.id && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Athlete Statistics
            {isLoadingStats && <span className="ml-2 text-sm text-muted-foreground">(Loading...)</span>}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="wins" className="block text-sm font-medium mb-1">
                Wins
              </label>
              <Input
                id="wins"
                type="number"
                disabled
                value={String(athleteStats.wins || 0)}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    wins: isNaN(value) ? 0 : value
                  });
                }}
                min="0"
              />
            </div>

            <div>
              <label htmlFor="losses" className="block text-sm font-medium mb-1">
                Losses
              </label>
              <Input
                id="losses"
                type="number"
                disabled
                value={String(athleteStats.losses || 0)}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    losses: isNaN(value) ? 0 : value
                  });
                }}
                min="0"
              />
            </div>

            <div>
              <label htmlFor="points" className="block text-sm font-medium mb-1">
                Points
              </label>
              <Input
                id="points"
                type="number"
                disabled
                value={String(athleteStats.points || 0)}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    points: isNaN(value) ? 0 : value
                  });
                }}
                min="0"
              />
            </div>

            <div>
              <label htmlFor="rebounds" className="block text-sm font-medium mb-1">
                Rebounds
              </label>
              <Input
                id="rebounds"
                type="number"
                disabled
                value={String(athleteStats.rebounds || 0)}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    rebounds: isNaN(value) ? 0 : value
                  });
                }}
                min="0"
              />
            </div>

            <div>
              <label htmlFor="assists" className="block text-sm font-medium mb-1">
                Assists
              </label>
              <Input
                id="assists"
                type="number"
                disabled
                value={String(athleteStats.assists || 0)}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    assists: isNaN(value) ? 0 : value
                  });
                }}
                min="0"
              />
            </div>

            <div>
              <label htmlFor="steals" className="block text-sm font-medium mb-1">
                Steals
              </label>
              <Input
                id="steals"
                type="number"
                disabled
                value={String(athleteStats.steals || 0)}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    steals: isNaN(value) ? 0 : value
                  });
                }}
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* <div className="pt-4">
        <Button
          onClick={handleUpdateCustomer}
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? "Updating..." : "Update Information"}
        </Button>
      </div> */}
    </div>
  );
}