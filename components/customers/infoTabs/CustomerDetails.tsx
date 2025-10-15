"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import {
  CustomerStatsUpdateRequestDto,
  UserUpdateRequestDto,
} from "@/app/api/Api";
import { useToast } from "@/hooks/use-toast";
import { updateCustomer } from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { SaveIcon } from "lucide-react";

// DetailsTab component displays and updates customer personal info and stats
type FormField = "first_name" | "last_name" | "email" | "phone";

const NAME_INPUT_PATTERN = /^[a-zA-Z\s'-]*$/;
const EMAIL_INPUT_PATTERN = /^[a-zA-Z0-9@._+-]*$/;
const PHONE_INPUT_PATTERN = /^\+?[0-9\s-]*$/;

export default function DetailsTab({
  customer,
  onCustomerUpdated,
  onClose,
}: {
  customer: Customer; // Customer data passed in
  onCustomerUpdated?: (updated: Partial<Customer>) => void; // Callback after update
  onClose?: () => void;
}) {
  const { toast } = useToast(); // Toast utility
  const { user } = useUser(); // Current user (for JWT)

  // Loading states for general update and stats initialization
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Form state initialized with customer personal info
  const [formData, setFormData] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: (() => {
      const phone = customer.phone || "";
      if (!phone) return "+1"; // Default to US country code
      return phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
    })(),
  });

  // State for athlete statistics, using DTO shape
  const [athleteStats, setAthleteStats] =
    useState<CustomerStatsUpdateRequestDto>({
      wins: 0,
      losses: 0,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
    });

  // Populate athleteStats when customer prop changes
  useEffect(() => {
    setIsLoadingStats(true);
    setAthleteStats({
      wins: customer.wins || 0,
      losses: customer.losses || 0,
      points: customer.points || 0,
      rebounds: customer.rebounds || 0,
      assists: customer.assists || 0,
      steals: customer.steals || 0,
    });
    setIsLoadingStats(false);
  }, [customer]);

  // Handler for updating form fields
  const handleChange = (field: FormField, value: string) => {
    const fieldPatterns: Record<FormField, RegExp> = {
      first_name: NAME_INPUT_PATTERN,
      last_name: NAME_INPUT_PATTERN,
      email: EMAIL_INPUT_PATTERN,
      phone: PHONE_INPUT_PATTERN,
    };

    const pattern = fieldPatterns[field];

    if (pattern && !pattern.test(value)) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler for updating stats fields (unused since inputs are disabled)
  const handleStatsChange = (field: string, value: number) => {
    setAthleteStats((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Main update function invoked on Save button click
  const handleUpdateCustomer = async () => {
    // Validate required fields
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim()
    ) {
      toast({
        status: "error",
        description: "Name and email are required fields",
      });
      return;
    }

    // Ensure JWT is available
    if (!user?.Jwt) {
      toast({ status: "error", description: "User JWT is missing" });
      return;
    }

    // Ensure customer ID is present
    if (!customer.id) {
      toast({ status: "error", description: "Customer ID is missing" });
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number with country code
      const digits = formData.phone.replace(/\D/g, "");
      const formattedPhone = digits.startsWith("1")
        ? `+${digits}`
        : `+1${digits}`;

      // Prepare payload for user update
      const updateData: UserUpdateRequestDto = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formattedPhone,
        country_alpha2_code: "US",
        dob: "2000-01-01", // Default DOB placeholder
        has_marketing_email_consent: false,
        has_sms_consent: false,
      };

      // Call service to update customer
      const error = await updateCustomer(customer.id, updateData, user.Jwt);

      if (error === null) {
        // Success toast and callback
        toast({
          status: "success",
          description: "Customer updated successfully",
        });
        if (onCustomerUpdated)
          onCustomerUpdated({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formattedPhone,
          });
        onClose?.();
      } else {
        // Show API error
        toast({ status: "error", description: error });
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        status: "error",
        description: "Failed to update customer information",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render form UI
  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name Input */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium mb-1"
            >
              First Name <span className="text-red-500"></span>
            </label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </div>

          {/* Last Name Input */}
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium mb-1"
            >
              Last Name <span className="text-red-500"></span>
            </label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-red-500"></span>
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            readOnly
            disabled
            className="cursor-not-allowed bg-muted"
          />
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+11234567890"
          />
        </div>
      </div>

      {/* Athlete Statistics Section (only if customer ID exists) */}
      {/* {customer.id && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Athlete Statistics
            {isLoadingStats && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Loading...)
              </span>
            )}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            // Wins
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
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    wins: isNaN(value) ? 0 : value,
                  });
                }}
                min="0"
              />
            </div>

            // Losses
            <div>
              <label
                htmlFor="losses"
                className="block text-sm font-medium mb-1"
              >
                Losses
              </label>
              <Input
                id="losses"
                type="number"
                disabled
                value={String(athleteStats.losses || 0)}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    losses: isNaN(value) ? 0 : value,
                  });
                }}
                min="0"
              />
            </div>

            // Points
            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium mb-1"
              >
                Points
              </label>
              <Input
                id="points"
                type="number"
                disabled
                value={String(athleteStats.points || 0)}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    points: isNaN(value) ? 0 : value,
                  });
                }}
                min="0"
              />
            </div>

            // Rebounds
            <div>
              <label
                htmlFor="rebounds"
                className="block text-sm font-medium mb-1"
              >
                Rebounds
              </label>
              <Input
                id="rebounds"
                type="number"
                disabled
                value={String(athleteStats.rebounds || 0)}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    rebounds: isNaN(value) ? 0 : value,
                  });
                }}
                min="0"
              />
            </div>

            // Assists
            <div>
              <label
                htmlFor="assists"
                className="block text-sm font-medium mb-1"
              >
                Assists
              </label>
              <Input
                id="assists"
                type="number"
                disabled
                value={String(athleteStats.assists || 0)}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    assists: isNaN(value) ? 0 : value,
                  });
                }}
                min="0"
              />
            </div>

            // Steals
            <div>
              <label
                htmlFor="steals"
                className="block text-sm font-medium mb-1"
              >
                Steals
              </label>
              <Input
                id="steals"
                type="number"
                disabled
                value={String(athleteStats.steals || 0)}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  setAthleteStats({
                    ...athleteStats,
                    steals: isNaN(value) ? 0 : value,
                  });
                }}
                min="0"
              />
            </div>
          </div>
        </div>
      )} */}

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <Button
          onClick={handleUpdateCustomer}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" />
          {isLoading ? "Updating..." : "Update Information"}
        </Button>
      </div>
    </div>
  );
}
