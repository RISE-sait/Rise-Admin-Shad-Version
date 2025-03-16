"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Customer } from "@/types/customer";
import getValue from "@/components/Singleton";

export default function DetailsTab({ customer }: { customer: Customer }) {
  // Combine first_name and last_name for the initial state
  const [data, setData] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: customer.phone || "",
  });

  const apiUrl = getValue("API");

  const updateField = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCustomer = async () => {
    // Ensure required fields are not empty
    if (!data.first_name.trim()) {
      toast.error("First name cannot be empty.");
      return;
    }

    if (!data.last_name.trim()) {
      toast.error("Last name cannot be empty.");
      return;
    }

    if (!data.email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/customers/${customer.customer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone || undefined,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      toast.success("Customer successfully updated");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pb-4">
          <p className="pb-2">
            First Name <span className="text-red-500">*</span>
          </p>
          <Input
            onChange={(e) => updateField("first_name", e.target.value)}
            type="text"
            value={data.first_name}
          />
        </div>

        <div className="pb-4">
          <p className="pb-2">
            Last Name <span className="text-red-500">*</span>
          </p>
          <Input
            onChange={(e) => updateField("last_name", e.target.value)}
            type="text"
            value={data.last_name}
          />
        </div>
      </div>

      <div className="pb-4">
        <p className="pb-2">
          Email <span className="text-red-500">*</span>
        </p>
        <Input
          onChange={(e) => updateField("email", e.target.value)}
          type="email"
          value={data.email}
        />
      </div>

      <div className="pb-4">
        <p className="pb-2">Phone</p>
        <Input
          onChange={(e) => updateField("phone", e.target.value)}
          type="tel"
          value={data.phone}
        />
      </div>
    </div>
  );
}