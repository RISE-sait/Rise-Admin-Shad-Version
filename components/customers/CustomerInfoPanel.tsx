"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Customer, CustomerCreditTransaction } from "@/types/customer";
import DetailsTab from "./infoTabs/CustomerDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  TrashIcon,
  UserCircle,
  CreditCard,
  RefreshCw,
  Coins,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCustomerById,
  archiveCustomer,
  unarchiveCustomer,
  addCustomerCredits,
  deductCustomerCredits,
  getCustomerCredits,
  getCustomerCreditTransactions,
} from "@/services/customer";
import { useUser } from "@/contexts/UserContext";

interface MembershipPlan {
  id: string;
  membership_name: string;
  status: string;
  start_date: Date | null;
  renewal_date: string;
}

interface CustomerInfoPanelProps {
  customer: Customer;
  onCustomerUpdated?: (updated: Partial<Customer>) => void;
  onCustomerArchived?: (id: string) => Promise<void> | void;
  onClose?: () => void;
}

export default function CustomerInfoPanel({
  customer,
  onCustomerUpdated,
  onCustomerArchived,
  onClose,
}: CustomerInfoPanelProps) {
  const [tabValue, setTabValue] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(customer);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const [creditsAction, setCreditsAction] = useState<"add" | "deduct" | null>(
    null
  );
  const [addCreditsAmount, setAddCreditsAmount] = useState("");
  const [deductCreditsAmount, setDeductCreditsAmount] = useState("");
  const [addCreditsDescription, setAddCreditsDescription] = useState("");
  const [deductCreditsDescription, setDeductCreditsDescription] = useState("");
  const [transactions, setTransactions] = useState<CustomerCreditTransaction[]>(
    []
  );
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );
  const [transactionsPagination, setTransactionsPagination] = useState({
    limit: 10,
    offset: 0,
  });
  const { limit: transactionsLimit, offset: transactionsOffset } =
    transactionsPagination;
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();

  const onCustomerUpdatedRef = useRef(onCustomerUpdated);

  useEffect(() => {
    onCustomerUpdatedRef.current = onCustomerUpdated;
  }, [onCustomerUpdated]);

  const numericCredits =
    typeof currentCustomer.credits === "number" ? currentCustomer.credits : 0;

  const transactionPage =
    transactionsLimit > 0
      ? Math.floor(transactionsOffset / transactionsLimit) + 1
      : 1;
  const transactionRangeStart =
    transactions.length > 0 ? transactionsOffset + 1 : 0;
  const transactionRangeEnd = transactionsOffset + transactions.length;

  const applyCreditsUpdate = useCallback(
    (customerId: string, nextCredits: number) => {
      if (!Number.isFinite(nextCredits)) {
        return;
      }

      setCurrentCustomer((prev) =>
        prev.id === customerId ? { ...prev, credits: nextCredits } : prev
      );

      onCustomerUpdatedRef.current?.({ credits: nextCredits });
    },
    []
  );
  const parsedAddAmount = Number(addCreditsAmount);
  const parsedDeductAmount = Number(deductCreditsAmount);
  const isAddDisabled =
    creditsAction !== null ||
    !user?.Jwt ||
    !addCreditsAmount.trim() ||
    !addCreditsDescription.trim() ||
    Number.isNaN(parsedAddAmount) ||
    parsedAddAmount <= 0;
  const isDeductDisabled =
    creditsAction !== null ||
    !user?.Jwt ||
    !deductCreditsAmount.trim() ||
    !deductCreditsDescription.trim() ||
    Number.isNaN(parsedDeductAmount) ||
    parsedDeductAmount <= 0 ||
    parsedDeductAmount > numericCredits;

  const loadCustomerCredits = useCallback(
    async (customerId: string) => {
      if (!customerId || !user?.Jwt) {
        return;
      }

      setIsCreditsLoading(true);
      try {
        const credits = await getCustomerCredits(customerId, user.Jwt);
        if (typeof credits === "number") {
          applyCreditsUpdate(customerId, credits);
        }
      } catch (error) {
        console.error("Error loading customer credits:", error);
        toast({
          status: "error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load customer credits",
          variant: "destructive",
        });
      } finally {
        setIsCreditsLoading(false);
      }
    },
    [applyCreditsUpdate, toast, user?.Jwt]
  );

  const fetchTransactions = useCallback(
    async (
      customerId: string,
      pagination: { limit?: number; offset?: number } = {}
    ) => {
      if (!customerId || !user?.Jwt) {
        return;
      }

      const limitToUse =
        typeof pagination.limit === "number" &&
        Number.isFinite(pagination.limit)
          ? pagination.limit
          : transactionsLimit;
      const offsetToUse =
        typeof pagination.offset === "number" &&
        Number.isFinite(pagination.offset)
          ? pagination.offset
          : transactionsOffset;

      setIsTransactionsLoading(true);
      setTransactionsError(null);

      try {
        const records = await getCustomerCreditTransactions(
          customerId,
          user.Jwt,
          {
            limit: limitToUse,
            offset: offsetToUse,
          }
        );
        setTransactions(records);
        setHasMoreTransactions(records.length === limitToUse);
      } catch (error) {
        console.error("Error loading customer credit transactions:", error);
        setTransactions([]);
        setHasMoreTransactions(false);
        setTransactionsError(
          error instanceof Error
            ? error.message
            : "Failed to load credit transactions."
        );
      } finally {
        setIsTransactionsLoading(false);
      }
    },
    [transactionsLimit, transactionsOffset, user?.Jwt]
  );

  useEffect(() => {
    setTransactions([]);
    setTransactionsError(null);
    setTransactionsPagination((prev) =>
      prev.offset === 0 ? prev : { ...prev, offset: 0 }
    );
  }, [customer.id]);

  useEffect(() => {
    // Update currentCustomer when the customer prop changes
    setCurrentCustomer(customer);

    // Initialize membership plans from the provided customer data
    if (customer.membership_plan_id) {
      const plan: MembershipPlan = {
        id: customer.membership_plan_id,
        membership_name: customer.membership_name || "Membership Plan",
        status: "Active",
        start_date: customer.membership_start_date,
        renewal_date: customer.membership_renewal_date,
      };
      setMembershipPlans([plan]);
    } else {
      setMembershipPlans([]);
    }
  }, [customer]);

  const refreshCustomerData = async () => {
    if (!customer.id) return;

    setIsLoading(true);
    try {
      // Use the unified getCustomerById function to get all data
      const refreshedCustomer = await getCustomerById(customer.id);
      if (refreshedCustomer) {
        setCurrentCustomer(refreshedCustomer);

        // Create a membership plan object from the customer data if available
        if (refreshedCustomer.membership_plan_id) {
          const membershipPlan: MembershipPlan = {
            id: refreshedCustomer.membership_plan_id,
            membership_name:
              refreshedCustomer.membership_name || "Membership Plan",
            status: "Active", // Assuming active if it exists
            start_date: refreshedCustomer.membership_start_date,
            renewal_date: refreshedCustomer.membership_renewal_date,
          };
          setMembershipPlans([membershipPlan]);
        } else {
          setMembershipPlans([]);
        }
        await Promise.all([
          loadCustomerCredits(refreshedCustomer.id),
          fetchTransactions(refreshedCustomer.id, {
            limit: transactionsLimit,
            offset: transactionsOffset,
          }),
        ]);
      }
    } catch (error) {
      console.error("Error refreshing customer data:", error);
      // Don't show error toast as this might be non-critical
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCreditsAndTransactions = useCallback(async () => {
    if (!currentCustomer.id) {
      return;
    }

    await Promise.all([
      loadCustomerCredits(currentCustomer.id),
      fetchTransactions(currentCustomer.id, {
        limit: transactionsLimit,
        offset: transactionsOffset,
      }),
    ]);
  }, [
    currentCustomer.id,
    fetchTransactions,
    loadCustomerCredits,
    transactionsLimit,
    transactionsOffset,
  ]);

  const handleTransactionsRetry = useCallback(() => {
    if (!currentCustomer.id) {
      return;
    }

    void fetchTransactions(currentCustomer.id, {
      limit: transactionsLimit,
      offset: transactionsOffset,
    });
  }, [
    currentCustomer.id,
    fetchTransactions,
    transactionsLimit,
    transactionsOffset,
  ]);

  useEffect(() => {
    if (!customer.id) {
      return;
    }

    loadCustomerCredits(customer.id);
  }, [customer.id, loadCustomerCredits]);

  useEffect(() => {
    if (!customer.id) {
      return;
    }

    void fetchTransactions(customer.id, {
      limit: transactionsLimit,
      offset: transactionsOffset,
    });
  }, [customer.id, fetchTransactions, transactionsLimit, transactionsOffset]);

  const handleArchiveToggle = async () => {
    try {
      if (!user) return;
      if (currentCustomer.is_archived) {
        await unarchiveCustomer(currentCustomer.id, user.Jwt);
        setCurrentCustomer((prev) => ({ ...prev, is_archived: false }));
        toast({
          status: "success",
          description: "Customer successfully unarchived",
        });
      } else {
        await archiveCustomer(currentCustomer.id, user.Jwt);
        setCurrentCustomer((prev) => ({ ...prev, is_archived: true }));
        toast({
          status: "success",
          description: "Customer successfully archived",
        });
      }
      onCustomerArchived?.(currentCustomer.id);
    } catch (error) {
      console.error("Error archiving customer:", error);
      toast({
        status: "error",
        description: "Error archiving customer",
        variant: "destructive",
      });
    }
  };

  const handleCreditMutation = async (type: "add" | "deduct") => {
    if (!currentCustomer.id) {
      return;
    }

    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be logged in to manage credits.",
        variant: "destructive",
      });
      return;
    }

    const rawValue =
      type === "add" ? addCreditsAmount.trim() : deductCreditsAmount.trim();
    const amount = Number(rawValue);

    if (!rawValue || Number.isNaN(amount) || amount <= 0) {
      toast({
        status: "error",
        description: "Please enter a valid credit amount.",
        variant: "destructive",
      });
      return;
    }

    const description =
      type === "add"
        ? addCreditsDescription.trim()
        : deductCreditsDescription.trim();

    if (!description) {
      toast({
        status: "error",
        description: "Please provide a description for this change.",
        variant: "destructive",
      });
      return;
    }

    if (
      type === "deduct" &&
      typeof currentCustomer.credits === "number" &&
      amount > currentCustomer.credits
    ) {
      toast({
        status: "error",
        description: "Cannot deduct more credits than the customer has.",
        variant: "destructive",
      });
      return;
    }

    setCreditsAction(type);
    try {
      const result =
        type === "add"
          ? await addCustomerCredits(
              currentCustomer.id,
              amount,
              description,
              user.Jwt
            )
          : await deductCustomerCredits(
              currentCustomer.id,
              amount,
              description,
              user.Jwt
            );

      const fallbackBalance =
        typeof currentCustomer.credits === "number"
          ? type === "add"
            ? currentCustomer.credits + amount
            : currentCustomer.credits - amount
          : undefined;

      const nextBalance =
        typeof result.balance === "number" ? result.balance : fallbackBalance;

      if (typeof nextBalance === "number") {
        applyCreditsUpdate(currentCustomer.id, nextBalance);
      }

      if (typeof result.balance !== "number") {
        await loadCustomerCredits(currentCustomer.id);
      }

      await fetchTransactions(currentCustomer.id, {
        limit: transactionsLimit,
        offset: transactionsOffset,
      });

      toast({
        status: "success",
        description:
          type === "add"
            ? `Successfully added ${amount} credits.`
            : `Successfully deducted ${amount} credits.`,
      });

      if (type === "add") {
        setAddCreditsAmount("");
        setAddCreditsDescription("");
      } else {
        setDeductCreditsAmount("");
        setDeductCreditsDescription("");
      }
    } catch (error) {
      console.error("Error updating customer credits:", error);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update customer credits.",
        variant: "destructive",
      });
    } finally {
      setCreditsAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={refreshCustomerData}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue}>
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <UserCircle className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="membership"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              Membership
            </TabsTrigger>
            <TabsTrigger
              value="credits"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Coins className="h-4 w-4" />
              Credits
            </TabsTrigger>
            {/* <TabsTrigger
              value="stats"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Award className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Clock className="h-4 w-4" />
              Attendance
            </TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="details">
          <DetailsTab
            customer={currentCustomer}
            onCustomerUpdated={(updated) => {
              setCurrentCustomer((prev) => ({ ...prev, ...updated }));
              onCustomerUpdated?.(updated);
              toast({
                status: "success",
                description: "Customer information updated",
              });
            }}
            onClose={onClose}
          />
        </TabsContent>

        <TabsContent value="membership">
          {membershipPlans && membershipPlans.length > 0 ? (
            <div className="space-y-4">
              {membershipPlans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium">
                    {plan.membership_name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 font-medium">{plan.status}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <span className="ml-2 font-medium">
                        {plan.start_date
                          ? new Date(plan.start_date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Renewal:</span>
                      <span className="ml-2 font-medium">
                        {plan.renewal_date
                          ? new Date(plan.renewal_date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mb-4">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No Membership Information
              </h3>
              <p className="text-muted-foreground">
                This customer doesn't have any membership plans associated with
                their account.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="credits">
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Balance
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">
                      {isCreditsLoading ? "Loading..." : numericCredits}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      credits
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void refreshCreditsAndTransactions()}
                  disabled={
                    isCreditsLoading || isTransactionsLoading || !user?.Jwt
                  }
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isCreditsLoading || isTransactionsLoading
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  Refresh Balance
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Manage this customer's available credits by adding or deducting
                amounts below.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4 rounded-lg border p-4">
                <div>
                  <h3 className="text-base font-semibold">Add Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Increase the customer's available credits.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="add-credits-amount">Amount</Label>
                      <Input
                        id="add-credits-amount"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Amount"
                        value={addCreditsAmount}
                        onChange={(event) =>
                          setAddCreditsAmount(event.target.value)
                        }
                        disabled={creditsAction !== null}
                      />
                    </div>
                    <Button
                      type="button"
                      className="w-full sm:w-auto"
                      onClick={() => handleCreditMutation("add")}
                      disabled={isAddDisabled}
                    >
                      {creditsAction === "add" ? "Adding..." : "Add"}
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="add-credits-description">Description</Label>
                    <Textarea
                      id="add-credits-description"
                      placeholder="Describe the reason for adding credits"
                      value={addCreditsDescription}
                      onChange={(event) =>
                        setAddCreditsDescription(event.target.value)
                      }
                      disabled={creditsAction !== null}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border p-4">
                <div>
                  <h3 className="text-base font-semibold">Deduct Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce the customer's available credits.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="deduct-credits-amount">Amount</Label>
                      <Input
                        id="deduct-credits-amount"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Amount"
                        value={deductCreditsAmount}
                        onChange={(event) =>
                          setDeductCreditsAmount(event.target.value)
                        }
                        disabled={creditsAction !== null}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() => handleCreditMutation("deduct")}
                      disabled={isDeductDisabled}
                    >
                      {creditsAction === "deduct" ? "Deducting..." : "Deduct"}
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="deduct-credits-description">
                      Description
                    </Label>
                    <Textarea
                      id="deduct-credits-description"
                      placeholder="Describe the reason for deducting credits"
                      value={deductCreditsDescription}
                      onChange={(event) =>
                        setDeductCreditsDescription(event.target.value)
                      }
                      disabled={creditsAction !== null}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Credit History</h3>
                    <p className="text-sm text-muted-foreground">
                      Review the most recent credit adjustments applied to this
                      account.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isTransactionsLoading && (
                      <span className="text-xs text-muted-foreground">
                        Updating…
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="transaction-page-size"
                        className="text-sm text-muted-foreground"
                      >
                        Rows per page
                      </Label>
                      <select
                        id="transaction-page-size"
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                        value={transactionsLimit}
                        onChange={(event) => {
                          const nextLimit = Number(event.target.value);
                          setTransactionsPagination({
                            limit:
                              Number.isFinite(nextLimit) && nextLimit > 0
                                ? nextLimit
                                : 10,
                            offset: 0,
                          });
                        }}
                        disabled={isTransactionsLoading}
                      >
                        {[10, 20, 50].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border">
                  {isTransactionsLoading && transactions.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Loading transactions…
                    </div>
                  ) : transactionsError ? (
                    <div className="p-6 text-center space-y-4">
                      <p className="text-sm text-destructive">
                        {transactionsError}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleTransactionsRetry}
                        disabled={isTransactionsLoading}
                      >
                        Try again
                      </Button>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No credit transactions found.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="cursor-default hover:bg-transparent">
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => {
                          const normalizedAmount = Number.isFinite(
                            transaction.amount
                          )
                            ? transaction.amount
                            : Number(transaction.amount) || 0;
                          const isDebit =
                            normalizedAmount < 0 ||
                            (typeof transaction.type === "string" &&
                              /deduct|debit|withdraw|remove/.test(
                                transaction.type.toLowerCase()
                              ));
                          const displayAmount = Math.abs(normalizedAmount);
                          const formattedAmount = displayAmount.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }
                          );
                          const createdAtDate = new Date(
                            transaction.created_at
                          );
                          const formattedDate = Number.isNaN(
                            createdAtDate.getTime()
                          )
                            ? transaction.created_at
                            : createdAtDate.toLocaleString();
                          const descriptionText =
                            typeof transaction.description === "string"
                              ? transaction.description.trim()
                              : "";
                          const fallbackTypeText =
                            typeof transaction.type === "string"
                              ? transaction.type.trim()
                              : "";
                          const descriptionContent =
                            descriptionText || fallbackTypeText || "—";

                          return (
                            <TableRow
                              key={transaction.id}
                              className="cursor-default hover:bg-transparent"
                            >
                              <TableCell className="whitespace-nowrap">
                                {formattedDate}
                              </TableCell>
                              <TableCell className="max-w-md whitespace-pre-line break-words text-sm">
                                {descriptionContent}
                              </TableCell>
                              <TableCell
                                className={`text-right font-medium ${
                                  isDebit
                                    ? "text-destructive"
                                    : "text-emerald-600 dark:text-emerald-400"
                                }`}
                              >
                                {`${isDebit ? "-" : "+"}${formattedAmount}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    {transactions.length > 0
                      ? `Showing ${transactionRangeStart}–${transactionRangeEnd} (Page ${transactionPage})`
                      : "Showing 0 transactions"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setTransactionsPagination((prev) => ({
                          ...prev,
                          offset: Math.max(0, prev.offset - prev.limit),
                        }))
                      }
                      disabled={
                        transactionsOffset === 0 || isTransactionsLoading
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setTransactionsPagination((prev) => ({
                          ...prev,
                          offset: prev.offset + prev.limit,
                        }))
                      }
                      disabled={!hasMoreTransactions || isTransactionsLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Stats Tab - This will show the athlete_info data that is available */}
        {/* <TabsContent value="stats">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Athletic Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.assists}</p>
                <p className="text-sm text-muted-foreground">Assists</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.points}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.rebounds}</p>
                <p className="text-sm text-muted-foreground">Rebounds</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{currentCustomer.steals}</p>
                <p className="text-sm text-muted-foreground">Steals</p>
              </div>
              <div className="bg-success/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-success">{currentCustomer.wins}</p>
                <p className="text-sm text-muted-foreground">Wins</p>
              </div>
              <div className="bg-destructive/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-destructive">{currentCustomer.losses}</p>
                <p className="text-sm text-muted-foreground">Losses</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="p-8 text-center">
            <div className="mb-4">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-medium mb-2">Attendance History</h3>
            <p className="text-muted-foreground">
              Attendance tracking feature will be available soon.
            </p>
          </div>
        </TabsContent>*/}
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-full mx-auto px-2 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated:{" "}
            {currentCustomer.updated_at
              ? new Date(currentCustomer.updated_at).toLocaleString()
              : "Never"}
          </p>

          <div className="flex items-center gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  {currentCustomer.is_archived ? "Unarchive" : "Archive"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {currentCustomer.is_archived
                      ? "Confirm Unarchive"
                      : "Confirm Archive"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {currentCustomer.is_archived
                      ? "Are you sure you want to unarchive this customer?"
                      : "Are you sure you want to archive this customer?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchiveToggle}>
                    {currentCustomer.is_archived
                      ? "Confirm Unarchive"
                      : "Confirm Archive"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
