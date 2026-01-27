"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Send,
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Receipt,
  HelpCircle,
  History,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import {
  CustomerBalance,
  PaymentMethod,
  ChargeCardResponse,
  CollectionAttempt,
} from "@/types/collections";
import {
  getCustomerBalance,
  getCustomerPaymentMethods,
  sendPaymentLink,
  chargeCard,
  recordManualPayment,
  getCollectionHistory,
} from "@/services/collections";
import { cn } from "@/lib/utils";

interface CollectPaymentProps {
  customerId: string;
  customerEmail?: string;
  onPaymentCollected?: () => void;
}

type CollectionTab = "send-link" | "charge-card" | "manual" | "history";
type ManualPaymentType = "cash" | "check" | "e-transfer" | "other";

export default function CollectPayment({
  customerId,
  customerEmail,
  onPaymentCollected,
}: CollectPaymentProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const jwt = user?.Jwt;

  // Data states
  const [balance, setBalance] = useState<CustomerBalance | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);

  // History states
  const [history, setHistory] = useState<CollectionAttempt[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // UI states
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<CollectionTab>("send-link");

  // Form states - Send Payment Link
  const [linkAmount, setLinkAmount] = useState("");
  const [linkEmail, setLinkEmail] = useState(customerEmail || "");
  const [linkDescription, setLinkDescription] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [sentLinkUrl, setSentLinkUrl] = useState<string | null>(null);

  // Form states - Charge Card
  const [chargeAmount, setChargeAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [chargeNotes, setChargeNotes] = useState("");
  const [isCharging, setIsCharging] = useState(false);
  const [chargeResult, setChargeResult] = useState<ChargeCardResponse | null>(null);

  // Form states - Manual Payment
  const [manualAmount, setManualAmount] = useState("");
  const [manualPaymentType, setManualPaymentType] = useState<ManualPaymentType>("cash");
  const [manualNotes, setManualNotes] = useState("");
  const [isRecordingManual, setIsRecordingManual] = useState(false);
  const [manualRecorded, setManualRecorded] = useState(false);

  // Fetch balance on mount
  const fetchBalance = useCallback(async () => {
    if (!jwt || !customerId) {
      setIsLoadingBalance(false);
      return;
    }

    setIsLoadingBalance(true);
    setBalanceError(null);

    try {
      const balanceData = await getCustomerBalance(customerId, jwt);
      setBalance(balanceData);

      if (balanceData.past_due_amount > 0) {
        const amountStr = balanceData.past_due_amount.toFixed(2);
        setLinkAmount(amountStr);
        setChargeAmount(amountStr);
        setManualAmount(amountStr);
      } else {
        // Membership is past_due but balance is $0 - data inconsistency
        setBalanceError("No outstanding balance found. The membership status may be out of sync.");
      }

      if (balanceData.has_payment_method) {
        setIsLoadingMethods(true);
        try {
          const methodsData = await getCustomerPaymentMethods(customerId, jwt);
          setPaymentMethods(methodsData.payment_methods || []);
          const defaultMethod = methodsData.payment_methods?.find(m => m.is_default);
          if (defaultMethod) {
            setSelectedPaymentMethod(defaultMethod.id);
          } else if (methodsData.payment_methods?.length > 0) {
            setSelectedPaymentMethod(methodsData.payment_methods[0].id);
          }
        } catch (err) {
          console.error("Failed to fetch payment methods:", err);
        } finally {
          setIsLoadingMethods(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setBalanceError("Unable to load balance. The collections API may not be available yet.");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [customerId, jwt]);

  // Fetch collection history
  const fetchHistory = useCallback(async () => {
    if (!jwt || !customerId) return;

    setIsLoadingHistory(true);
    try {
      const historyData = await getCollectionHistory({ customer_id: customerId, limit: 10 }, jwt);
      setHistory(historyData.attempts || []);
    } catch (err) {
      console.error("Failed to fetch collection history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [customerId, jwt]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Fetch history when tab is selected
  useEffect(() => {
    if (activeTab === "history" && history.length === 0) {
      fetchHistory();
    }
  }, [activeTab, history.length, fetchHistory]);

  useEffect(() => {
    if (customerEmail && !linkEmail) {
      setLinkEmail(customerEmail);
    }
  }, [customerEmail, linkEmail]);

  const handleSendPaymentLink = async () => {
    if (!jwt || !linkAmount) return;

    const amount = parseFloat(linkAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", status: "error" });
      return;
    }

    setIsSendingLink(true);
    setSentLinkUrl(null);

    try {
      const response = await sendPaymentLink(
        {
          customer_id: customerId,
          amount,
          description: linkDescription || undefined,
          send_email: true,
          email_override: linkEmail !== customerEmail ? linkEmail : undefined,
        },
        jwt
      );

      setSentLinkUrl(response.payment_link_url);
      toast({ title: "Payment Link Sent", description: `Sent to ${linkEmail}`, status: "success" });
      onPaymentCollected?.();
      fetchHistory(); // Refresh history
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send payment link";
      toast({ title: "Error", description: message, status: "error" });
    } finally {
      setIsSendingLink(false);
    }
  };

  const handleChargeCard = async () => {
    if (!jwt || !chargeAmount || !selectedPaymentMethod) return;

    const amount = parseFloat(chargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", status: "error" });
      return;
    }

    setIsCharging(true);
    setChargeResult(null);

    try {
      const response = await chargeCard(
        {
          customer_id: customerId,
          payment_method_id: selectedPaymentMethod,
          amount,
          notes: chargeNotes || undefined,
        },
        jwt
      );

      setChargeResult(response);

      if (response.success) {
        toast({ title: "Payment Collected", description: `Charged $${response.amount_collected?.toFixed(2)}`, status: "success" });
        onPaymentCollected?.();
        fetchBalance();
        fetchHistory();
      } else {
        toast({ title: "Charge Failed", description: response.error_message || "Card declined", status: "error" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to charge card";
      toast({ title: "Error", description: message, status: "error" });
    } finally {
      setIsCharging(false);
    }
  };

  const handleRecordManualPayment = async () => {
    if (!jwt || !manualAmount) return;

    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", status: "error" });
      return;
    }

    setIsRecordingManual(true);
    setManualRecorded(false);

    try {
      await recordManualPayment(
        {
          customer_id: customerId,
          amount,
          payment_method: manualPaymentType,
          notes: manualNotes || undefined,
        },
        jwt
      );

      setManualRecorded(true);
      toast({ title: "Payment Recorded", description: `$${amount.toFixed(2)} ${manualPaymentType} payment`, status: "success" });
      onPaymentCollected?.();
      fetchBalance();
      fetchHistory();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to record payment";
      toast({ title: "Error", description: message, status: "error" });
    } finally {
      setIsRecordingManual(false);
    }
  };

  const copyLinkToClipboard = () => {
    if (sentLinkUrl) {
      navigator.clipboard.writeText(sentLinkUrl);
      toast({ title: "Copied", description: "Link copied to clipboard", status: "success" });
    }
  };

  const formatCollectionMethod = (method: string) => {
    switch (method) {
      case "card_charge": return "Card";
      case "payment_link": return "Link";
      case "manual_entry": return "Manual";
      default: return method;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoadingBalance) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayAmount = balance?.past_due_amount ?? 0;
  const hasBalanceData = balance !== null && balance.past_due_amount > 0;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="font-medium text-sm">Payment Past Due</p>
            <p className="text-xs text-muted-foreground">
              {hasBalanceData
                ? `$${displayAmount.toFixed(2)} outstanding`
                : balanceError
                  ? "Unable to load amount"
                  : "Collection required"
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <Badge variant="outline" className="text-xs">
              Collect
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t p-4 space-y-4">
          {/* Error state */}
          {balanceError && (
            <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{balanceError}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={fetchBalance}
                className="h-7 px-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as CollectionTab)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 h-9">
              <TabsTrigger value="send-link" className="text-xs gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Link</span>
              </TabsTrigger>
              <TabsTrigger
                value="charge-card"
                disabled={!balance?.has_payment_method && paymentMethods.length === 0}
                className="text-xs gap-1.5"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Card</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="text-xs gap-1.5">
                <Banknote className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Manual</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs gap-1.5">
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            {/* Send Link Tab */}
            <TabsContent value="send-link" className="space-y-3 mt-4">
              <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/50 text-xs text-muted-foreground">
                <HelpCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <p>Sends a secure Stripe payment link to the customer&apos;s email. They can pay using any card.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="link-amount" className="text-xs">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      id="link-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={linkAmount}
                      onChange={(e) => setLinkAmount(e.target.value)}
                      className="pl-7 h-9"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="link-email" className="text-xs">Email</Label>
                  <Input
                    id="link-email"
                    type="email"
                    value={linkEmail}
                    onChange={(e) => setLinkEmail(e.target.value)}
                    className="h-9"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label htmlFor="link-description" className="text-xs">Description (optional)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p>This appears on the payment page and receipt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="link-description"
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  className="h-9"
                  placeholder="Past due membership payment"
                />
              </div>

              {sentLinkUrl && (
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-muted text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="flex-1 truncate text-xs">{sentLinkUrl}</span>
                  <Button size="sm" variant="ghost" onClick={copyLinkToClipboard} className="h-7 w-7 p-0">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" asChild className="h-7 w-7 p-0">
                    <a href={sentLinkUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              )}

              <Button
                onClick={handleSendPaymentLink}
                disabled={isSendingLink || !linkAmount || !linkEmail}
                className="w-full h-9"
                size="sm"
              >
                {isSendingLink ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Payment Link
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Charge Card Tab */}
            <TabsContent value="charge-card" className="space-y-3 mt-4">
              <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/50 text-xs text-muted-foreground">
                <HelpCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <p>Instantly charges the customer&apos;s saved card. Use this when you have verbal authorization from the customer.</p>
              </div>
              {isLoadingMethods ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No payment methods on file
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="charge-amount" className="text-xs">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <Input
                          id="charge-amount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={chargeAmount}
                          onChange={(e) => setChargeAmount(e.target.value)}
                          className="pl-7 h-9"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Card</Label>
                      <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select card" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              <span className="capitalize">{method.brand}</span> ****{method.last4}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="charge-notes" className="text-xs">Notes (optional)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <p>Internal note for your records (not shown to customer)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="charge-notes"
                      value={chargeNotes}
                      onChange={(e) => setChargeNotes(e.target.value)}
                      className="h-9"
                      placeholder="Collected via phone call"
                    />
                  </div>

                  {chargeResult && (
                    <div className={cn(
                      "flex items-center gap-2 p-2.5 rounded-md text-sm",
                      chargeResult.success ? "bg-muted" : "bg-destructive/10"
                    )}>
                      {chargeResult.success ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="flex-1 text-xs">Charged ${chargeResult.amount_collected?.toFixed(2)}</span>
                          {chargeResult.receipt_url && (
                            <Button size="sm" variant="ghost" asChild className="h-7 px-2">
                              <a href={chargeResult.receipt_url} target="_blank" rel="noopener noreferrer">
                                <Receipt className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Receipt</span>
                              </a>
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          <span className="text-xs text-destructive">{chargeResult.error_message || "Card declined"}</span>
                        </>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleChargeCard}
                    disabled={isCharging || !chargeAmount || !selectedPaymentMethod}
                    className="w-full h-9"
                    size="sm"
                  >
                    {isCharging ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Charge ${chargeAmount || "0.00"}
                      </>
                    )}
                  </Button>
                </>
              )}
            </TabsContent>

            {/* Manual Tab */}
            <TabsContent value="manual" className="space-y-3 mt-4">
              <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/50 text-xs text-muted-foreground">
                <HelpCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <p>Record a payment received in person (cash, check, e-transfer). This logs the payment but doesn&apos;t process any transaction.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="manual-amount" className="text-xs">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      id="manual-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      className="pl-7 h-9"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Type</Label>
                  <Select value={manualPaymentType} onValueChange={(v) => setManualPaymentType(v as ManualPaymentType)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="e-transfer">E-Transfer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label htmlFor="manual-notes" className="text-xs">Notes (optional)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p>Include check number, receipt details, or other reference info</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="manual-notes"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Paid at front desk, check #1234"
                  rows={2}
                  className="resize-none"
                />
              </div>

              {manualRecorded && (
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-muted text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-xs">Payment recorded</span>
                </div>
              )}

              <Button
                onClick={handleRecordManualPayment}
                disabled={isRecordingManual || !manualAmount}
                className="w-full h-9"
                size="sm"
              >
                {isRecordingManual ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Banknote className="h-4 w-4 mr-2" />
                    Record Payment
                  </>
                )}
              </Button>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Collection Attempts</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={fetchHistory}
                  disabled={isLoadingHistory}
                  className="h-7 px-2"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoadingHistory && "animate-spin")} />
                </Button>
              </div>

              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No collection attempts yet
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between text-xs p-2.5 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        {attempt.status === "success" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        ) : attempt.status === "failed" ? (
                          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                        ) : (
                          <Loader2 className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">
                            ${parseFloat(attempt.amount_attempted).toFixed(2)} via {formatCollectionMethod(attempt.collection_method)}
                          </p>
                          <p className="text-muted-foreground">{formatDate(attempt.created_at)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={attempt.status === "success" ? "default" : attempt.status === "failed" ? "destructive" : "secondary"}
                        className="text-xs capitalize"
                      >
                        {attempt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Open Invoices */}
          {hasBalanceData && balance!.open_invoices.length > 0 && activeTab !== "history" && (
            <div className="pt-3 border-t space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Open Invoices</p>
              {balance!.open_invoices.map((invoice) => (
                <div
                  key={invoice.invoice_id}
                  className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{invoice.description}</p>
                    <p className="text-muted-foreground">Due {new Date(invoice.due_date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-mono">${invoice.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
