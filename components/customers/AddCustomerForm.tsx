"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, User, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { createCustomer } from "@/services/customer";
import { revalidateCustomers } from "@/actions/serverActions";

interface AddCustomerFormProps {
  onCustomerAdded?: () => void;
  onCancel?: () => void;
}

export default function AddCustomerForm({
  onCustomerAdded,
  onCancel,
}: AddCustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "+1",
  });

  const { toast } = useToast();
  const { user } = useUser();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCustomer = async () => {
    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        status: "error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        status: "error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be logged in to add customers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number
      const digits = formData.phone.replace(/\D/g, "");
      const formattedPhone = digits.startsWith("1")
        ? `+${digits}`
        : `+1${digits}`;

      const customerData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formattedPhone,
        country_alpha2_code: "US",
        dob: "2000-01-01", // Default DOB placeholder
        has_marketing_email_consent: false,
        has_sms_consent: false,
      };

      const error = await createCustomer(customerData, user.Jwt);

      if (error === null) {
        toast({
          status: "success",
          description: "Customer created successfully",
        });

        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "+1",
        });

        await revalidateCustomers();
        onCustomerAdded?.();
        onCancel?.();
      } else {
        toast({
          status: "error",
          description: `Failed to create customer: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        status: "error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-3">
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
                  placeholder="Enter first name"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Enter last name"
                  className="bg-background"
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
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="customer@example.com"
                className="bg-background"
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          onClick={handleAddCustomer}
          disabled={isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          {isLoading ? "Creating..." : "Create Customer"}
        </Button>
      </div>
    </div>
  );
}
