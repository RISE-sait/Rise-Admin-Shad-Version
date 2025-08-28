"use client";

import React, { useEffect, useRef, useState } from "react";
import { checkInCustomer, getCustomerById } from "@/services/customer";
import { Customer } from "@/types/customer";
import { CustomerMembershipResponseDto } from "@/app/api/Api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoginLogTable from "@/components/checkin/table/LoginLogTable";
import { LoginLog } from "@/types/login-logs";

export default function CheckInPage() {
  const [customerId, setCustomerId] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [membershipInfo, setMembershipInfo] =
    useState<CustomerMembershipResponseDto | null>(null);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerId) return;

    try {
      const membership = await checkInCustomer(customerId);
      setMembershipInfo(membership);
      const customerData = await getCustomerById(customerId);
      if (customerData) {
        setCustomer(customerData);
        setLoginLogs((prev) => [
          {
            id: customerData.id,
            name: `${customerData.first_name} ${customerData.last_name}`,
            email: customerData.email,
            loginTime: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("Check-in failed", error);
      setMembershipInfo(null);
      setCustomer(null);
    } finally {
      setCustomerId("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Scan customer ID"
          className="w-full rounded border p-2"
          autoFocus
        />
      </form>

      {customer && (
        <div className="mt-4 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={customer.profilePicture || ""}
              alt={`${customer.first_name} ${customer.last_name}`}
            />
            <AvatarFallback>
              {customer.first_name?.[0]}
              {customer.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">
              {customer.first_name} {customer.last_name}
            </p>
            {membershipInfo ? (
              <>
                <p>
                  {membershipInfo.membership_name ||
                    membershipInfo.membership_plan_name}
                </p>
                {membershipInfo.membership_renewal_date && (
                  <p className="text-sm text-muted-foreground">
                    Ends{" "}
                    {new Date(
                      membershipInfo.membership_renewal_date
                    ).toLocaleDateString()}
                  </p>
                )}
              </>
            ) : (
              <p>No active membership</p>
            )}
          </div>
        </div>
      )}
      <LoginLogTable logs={loginLogs} />
    </div>
  );
}
