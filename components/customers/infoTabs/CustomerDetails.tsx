"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import { UserUpdateRequestDto } from "@/app/api/Api";
import { useToast } from "@/hooks/use-toast";
import { updateCustomer } from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { SaveIcon, User, Mail } from "lucide-react";
import { StaffRoleEnum } from "@/types/user";

type FormField = "first_name" | "last_name" | "email" | "phone";

const NAME_INPUT_PATTERN = /^[a-zA-Z\s'-]*$/;
const EMAIL_INPUT_PATTERN = /^[a-zA-Z0-9@._+-]*$/;
const PHONE_INPUT_PATTERN = /^\+?[0-9\s-]*$/;

export default function DetailsTab({
  customer,
  onCustomerUpdated,
  onClose,
}: {
  customer: Customer;
  onCustomerUpdated?: (updated: Partial<Customer>) => void;
  onClose?: () => void;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: (() => {
      const phone = customer.phone || "";
      if (!phone) return "+1";
      return phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
    })(),
  });

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

  const handleUpdateCustomer = async () => {
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim()
    ) {
      toast({
        status: "error",
        description: "Name and email are required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "User JWT is missing",
        variant: "destructive",
      });
      return;
    }

    if (!customer.id) {
      toast({
        status: "error",
        description: "Customer ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const digits = formData.phone.replace(/\D/g, "");
      const formattedPhone = digits.startsWith("1")
        ? `+${digits}`
        : `+1${digits}`;

      const updateData: UserUpdateRequestDto = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formattedPhone,
        country_alpha2_code: "US",
        dob: "2000-01-01",
        has_marketing_email_consent: false,
        has_sms_consent: false,
      };

      const error = await updateCustomer(customer.id, updateData, user.Jwt);

      if (error === null) {
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
        toast({
          status: "error",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        status: "error",
        description: "Failed to update customer information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className="bg-background"
                  disabled={isReceptionist}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className="bg-background"
                  disabled={isReceptionist}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Contact Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                readOnly
                disabled
                className="cursor-not-allowed bg-muted"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+11234567890"
                className="bg-background"
                disabled={isReceptionist}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {!isReceptionist && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            onClick={handleUpdateCustomer}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
