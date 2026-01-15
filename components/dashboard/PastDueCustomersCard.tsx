"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { getCustomers } from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function PastDueCustomersCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useUser();
  const router = useRouter();

  const loadPastDueCount = async () => {
    if (!user?.Jwt) return;

    setIsLoading(true);
    try {
      const result = await getCustomers(undefined, 1, 1, user.Jwt, {
        subscription_status: "past_due",
      });
      setTotalCount(result.total);
    } catch (error) {
      console.error("Error loading past due count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPastDueCount();
  }, [user?.Jwt]);

  const handleClick = () => {
    router.push("/manage/customers?subscription_status=past_due");
  };

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${totalCount > 0 ? "border-red-200 dark:border-red-900/50" : ""}`}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Past Due Payments
        </CardTitle>
        <AlertTriangle className={`h-4 w-4 ${totalCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${totalCount > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
          {isLoading ? "..." : totalCount}
        </div>
        {totalCount > 0 && (
          <p className="text-xs text-red-500 mt-1">
            Click to view & collect
          </p>
        )}
      </CardContent>
    </Card>
  );
}
