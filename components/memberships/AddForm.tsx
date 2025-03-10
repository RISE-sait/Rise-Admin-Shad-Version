"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer } from "../../types/customer";

export default function AddClientForm({
  onAddClient,
}: {
  onAddClient: (client: Customer) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [membership, setMembership] = useState("");
  const [accountType, setAccountType] = useState("");
  const [attendance, setAttendance] = useState(123);
  const [membership_renewal_date, setMembership_renewal_date] = useState("");

  const handleAdd = () => {
    const newClient: Customer = {
      customer_id: String(Date.now()),
      name,
      email,
      phone,
      membership,
      accountType,
      profilePicture: "",
      attendance,
      membership_renewal_date,
    };
    onAddClient(newClient);
    setName("");
    setEmail("");
    setPhone("");
    setMembership("");
    setAccountType("");
    setAttendance(222222);
    setMembership_renewal_date("");
  };

  return (
    <div className="p-6 space-y-4">
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        placeholder="Membership"
        value={membership}
        onChange={(e) => setMembership(e.target.value)}
      />
      <Input
        placeholder="Account Type"
        value={accountType}
        onChange={(e) => setAccountType(e.target.value)}
      />
      <Button onClick={handleAdd}>Add</Button>
    </div>
  );
}
