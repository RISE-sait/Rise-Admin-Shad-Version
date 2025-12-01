"use client";

import React, { useEffect, useRef, useState } from "react";
import { checkInCustomer, getCustomerById } from "@/services/customer";
import { Customer } from "@/types/customer";
import { CustomerMembershipResponseDto } from "@/app/api/Api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import LoginLogTable from "@/components/checkin/table/LoginLogTable";
import { LoginLog } from "@/types/login-logs";
import { loadLogs, saveLogs } from "@/utils/checkinLogs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CUSTOMER_ID_REGEX = /^[A-Za-z0-9-]*$/;

export default function CheckInPage() {
  const [customerId, setCustomerId] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [membershipInfo, setMembershipInfo] =
    useState<CustomerMembershipResponseDto | null>(null);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [showNoMembershipAlert, setShowNoMembershipAlert] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setLoginLogs(loadLogs());
  }, []);

  useEffect(() => {
    if (showNoMembershipAlert) {
      const timer = setTimeout(() => setShowNoMembershipAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNoMembershipAlert]);

  const handleInputChange = (value: string) => {
    if (CUSTOMER_ID_REGEX.test(value)) {
      setCustomerId(value);
      setInputError(null);
    } else {
      setInputError(
        "Customer ID can only include letters, numbers, and hyphens."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedCustomerId = customerId.trim();
    if (!sanitizedCustomerId) {
      setInputError("Please enter a valid customer ID.");
      return;
    }

    try {
      const membership = await checkInCustomer(sanitizedCustomerId);
      setMembershipInfo(membership);
      if (!membership) {
        setShowNoMembershipAlert(true);
      }
      const customerData = await getCustomerById(sanitizedCustomerId);
      if (customerData) {
        setCustomer(customerData);
        setLoginLogs((prev) => {
          const updated = [
            {
              id: customerData.id,
              name: `${customerData.first_name} ${customerData.last_name}`,
              email: customerData.email,
              loginTime: new Date().toISOString(),
              membership: membership?.membership_name || membership?.membership_plan_name || null,
            },
            ...prev,
          ];
          saveLogs(updated);
          return updated;
        });
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("Check-in failed", error);
      setMembershipInfo(null);
      setCustomer(null);
    } finally {
      setCustomerId("");
      setInputError(null);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <div className="space-y-4 p-6">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={customerId}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Scan customer ID"
            className="w-full rounded border p-2"
            autoFocus
            pattern="[A-Za-z0-9-]*"
            aria-invalid={inputError ? "true" : "false"}
            aria-describedby={inputError ? "customer-id-error" : undefined}
            title="Only letters, numbers, and hyphens are allowed."
          />
          {inputError && (
            <p
              id="customer-id-error"
              className="mt-2 text-sm text-destructive"
              role="alert"
            >
              {inputError}
            </p>
          )}
        </form>

        {customer && (
          <Card className="mt-4">
            <CardContent className="flex items-center gap-6 p-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={customer.profilePicture || ""}
                  alt={`${customer.first_name} ${customer.last_name}`}
                />
                <AvatarFallback>
                  {customer.first_name?.[0]}
                  {customer.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-2 text-xl">
                <div className="flex gap-3">
                  <span className="font-medium">Name:</span>
                  <span>
                    {customer.first_name} {customer.last_name}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium">Membership:</span>
                  <span>
                    {membershipInfo
                      ? membershipInfo.membership_name ||
                        membershipInfo.membership_plan_name
                      : "No active membership"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium">Ends:</span>
                  <span>
                    {membershipInfo && membershipInfo.membership_renewal_date
                      ? new Date(
                          membershipInfo.membership_renewal_date
                        ).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <LoginLogTable logs={loginLogs} />
      </div>
      <AlertDialog
        open={showNoMembershipAlert}
        onOpenChange={setShowNoMembershipAlert}
      >
        <AlertDialogContent className="max-w-xl border-red-500 border-2 bg-red-50 dark:bg-red-950">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 dark:text-red-400 text-2xl">
              No active membership
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-600 dark:text-red-400 text-lg">
              This customer does not have an active membership.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
