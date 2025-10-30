"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, Clock, User, RefreshCw } from "lucide-react";
import { getSuspendedCustomers, SuspendedCustomer } from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function SuspendedCustomersCard() {
  const [suspendedCustomers, setSuspendedCustomers] = useState<
    SuspendedCustomer[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  const loadSuspendedCustomers = async () => {
    if (!user?.Jwt) return;

    setIsLoading(true);
    try {
      const customers = await getSuspendedCustomers(user.Jwt, 10);
      setSuspendedCustomers(customers);
    } catch (error) {
      console.error("Error loading suspended customers:", error);
      toast({
        status: "error",
        description: "Failed to load suspended customers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuspendedCustomers();
  }, [user?.Jwt]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              <div>
                <CardTitle>Suspended Customers</CardTitle>
                <CardDescription>
                  Members currently suspended from the facility
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSuspendedCustomers}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Loading suspended customers...
            </div>
          ) : suspendedCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Ban className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No suspended customers at this time
              </p>
            </div>
          ) : (
            suspendedCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </h4>
                    <Badge variant="destructive" className="text-xs">
                      Suspended
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(customer.suspended_at)}
                    </span>
                    {customer.suspension_expires_at && (
                      <span>
                        Expires: {formatDate(customer.suspension_expires_at)}
                      </span>
                    )}
                    {!customer.suspension_expires_at && (
                      <span className="text-red-500">Indefinite</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
