"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Customer } from "@/types/customer";
import getValue from "@/components/Singleton";

export default function DetailsTab({ customer }: { customer: Customer }) {
  const [data, setData] = useState({
    name: customer.name || "",
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
    if (!data.name.trim()) {
      toast.error("Customer name cannot be empty.");
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
            name: data.name,
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
      <div className="pb-4">
        <p className="pb-2">
          Name <span className="text-red-500">*</span>
        </p>
        <Input
          onChange={(e) => updateField("name", e.target.value)}
          type="text"
          value={data.name}
        />
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

      <section className="flex justify-between">
        <Button onClick={updateCustomer}>Save Changes</Button>
      </section>
    </div>
  );
}
