"use client";

import React, { useEffect, useRef, useState } from "react";
import { checkInCustomer, getCustomerById } from "@/services/customer";
import { Customer } from "@/types/customer";
import { CustomerMembershipResponseDto } from "@/app/api/Api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import LoginLogTable from "@/components/checkin/table/LoginLogTable";
import { LoginLog } from "@/types/login-logs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CheckInPage() {
  const [customerId, setCustomerId] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [membershipInfo, setMembershipInfo] =
    useState<CustomerMembershipResponseDto | null>(null);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [showNoMembershipAlert, setShowNoMembershipAlert] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (showNoMembershipAlert) {
      const timer = setTimeout(() => setShowNoMembershipAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNoMembershipAlert]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerId) return;

    try {
      const membership = await checkInCustomer(customerId);
      setMembershipInfo(membership);
      if (!membership) {
        setShowNoMembershipAlert(true);
      }
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
    <>
      <div className="space-y-4 p-6">
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
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>No active membership</AlertDialogTitle>
            <AlertDialogDescription>
              This customer does not have an active membership.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
