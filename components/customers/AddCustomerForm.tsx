"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import getValue from "../Singleton";

export default function AddCustomerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const apiUrl = getValue("API");

  const handleAddCustomer = async () => {
    // Check if required fields are empty
    if (!name.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      const response = await fetch(apiUrl + `/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to add customer:", errorText);
        toast.error("Failed to save customer. Please try again.");
        return;
      }

      toast.success("Customer successfully added");
    } catch (error) {
      console.error("Error during API request:", error);
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
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
        />
      </div>

      <div className="pb-4">
        <p className="pb-2">
          Email <span className="text-red-500">*</span>
        </p>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
        />
      </div>

      <div className="pb-4">
        <p className="pb-2">Phone</p>
        <Input
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          value={phone}
        />
      </div>

      <Button onClick={handleAddCustomer}>Add Customer</Button>
    </div>
  );
}
