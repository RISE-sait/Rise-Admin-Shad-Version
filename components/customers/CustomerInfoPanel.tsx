"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Customer,
  CustomerCreditTransaction,
  WaiverUpload,
} from "@/types/customer";
import DetailsTab from "./infoTabs/CustomerDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileText,
  SaveIcon,
  Ban,
  HandCoins,
  Plus,
  X,
  Upload,
  File,
  ExternalLink,
  AlertTriangle,
  Receipt,
  MoreHorizontal,
  Copy,
  Info,
  ChevronDown,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  getCustomerById,
  archiveCustomer,
  unarchiveCustomer,
  addCustomerCredits,
  deductCustomerCredits,
  getCustomerCredits,
  getCustomerCreditTransactions,
  updateCustomerNotes,
  getCustomerWaivers,
  uploadCustomerWaiver,
  deleteCustomerWaiver,
} from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { Api } from "@/app/api/Api";
import type { SuspensionInfoResponseDto } from "@/app/api/Api";
import getValue from "@/configs/constants";
import {
  getCustomerSubsidies,
  getSubsidyProviders,
  createSubsidy,
  deactivateSubsidy,
} from "@/services/subsidy";
import { Subsidy, SubsidyProvider } from "@/types/subsidy";
import { StaffRoleEnum } from "@/types/user";
import { MembershipPlan } from "@/types/membership";
import { getAllMembershipPlans } from "@/services/membershipPlan";
import { PaymentTransaction } from "@/types/payment-transaction";
import { getCustomerPaymentTransactions } from "@/services/payment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [membershipPlan, setMembershipPlan] = useState<MembershipPlan | null>(
    null
  );
  const [isMembershipLoading, setIsMembershipLoading] = useState(false);
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
  const [notesDraft, setNotesDraft] = useState(customer.notes ?? "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [suspensionData, setSuspensionData] =
    useState<SuspensionInfoResponseDto | null>(null);
  const [isSuspensionLoading, setIsSuspensionLoading] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [unsuspendDialogOpen, setUnsuspendDialogOpen] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("");
  const [collectArrears, setCollectArrears] = useState(false);
  const [extendMembership, setExtendMembership] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [isSubsidiesLoading, setIsSubsidiesLoading] = useState(false);
  const [createSubsidyDialogOpen, setCreateSubsidyDialogOpen] = useState(false);
  const [subsidyProviders, setSubsidyProviders] = useState<SubsidyProvider[]>(
    []
  );
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isCreatingSubsidy, setIsCreatingSubsidy] = useState(false);
  const [newSubsidyProviderId, setNewSubsidyProviderId] = useState("");
  const [newSubsidyAmount, setNewSubsidyAmount] = useState("");
  const [newSubsidyReason, setNewSubsidyReason] = useState("");
  const [newSubsidyValidUntil, setNewSubsidyValidUntil] = useState("");
  const [newSubsidyAdminNotes, setNewSubsidyAdminNotes] = useState("");
  const [deactivateSubsidyDialogOpen, setDeactivateSubsidyDialogOpen] =
    useState(false);
  const [subsidyToDeactivate, setSubsidyToDeactivate] =
    useState<Subsidy | null>(null);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Waiver state
  const [waivers, setWaivers] = useState<WaiverUpload[]>([]);
  const [isWaiversLoading, setIsWaiversLoading] = useState(false);
  const [uploadWaiverDialogOpen, setUploadWaiverDialogOpen] = useState(false);
  const [selectedWaiverFile, setSelectedWaiverFile] = useState<File | null>(
    null
  );
  const [waiverNotes, setWaiverNotes] = useState("");
  const [isUploadingWaiver, setIsUploadingWaiver] = useState(false);
  const [deleteWaiverDialogOpen, setDeleteWaiverDialogOpen] = useState(false);
  const [waiverToDelete, setWaiverToDelete] = useState<WaiverUpload | null>(
    null
  );
  const [isDeletingWaiver, setIsDeletingWaiver] = useState(false);
  const waiverFileInputRef = useRef<HTMLInputElement>(null);

  // Payment transactions state
  const [paymentTransactions, setPaymentTransactions] = useState<
    PaymentTransaction[]
  >([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentsPagination, setPaymentsPagination] = useState({
    limit: 10,
    offset: 0,
  });
  const [totalPayments, setTotalPayments] = useState(0);

  const CREDITS_AMOUNT_PATTERN = /^\d*$/;
  const NOTES_INPUT_PATTERN = /^[\w\s.,!?"'\-:;/\\&=?#@%()[\]{}~+]*$/;

  const { toast } = useToast();
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

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

  const loadSuspensionData = useCallback(
    async (customerId: string) => {
      if (!customerId || !user?.Jwt) {
        return;
      }

      setIsSuspensionLoading(true);
      try {
        const apiClient = new Api<{ token: string }>({
          baseUrl: getValue("API").replace(/\/$/, ""),
          securityWorker: (securityData) =>
            securityData?.token
              ? { headers: { Authorization: `Bearer ${securityData.token}` } }
              : {},
        });
        apiClient.setSecurityData({ token: user.Jwt });

        const resp = await apiClient.customers.getSuspension(customerId);
        // Api client returns an HttpResponse wrapper; extract the actual data payload
        setSuspensionData(resp?.data ?? null);
      } catch (error) {
        console.error("Error loading suspension data:", error);
        setSuspensionData(null);
      } finally {
        setIsSuspensionLoading(false);
      }
    },
    [user?.Jwt]
  );

  const loadSubsidyData = useCallback(
    async (customerId: string) => {
      if (!customerId || !user?.Jwt) {
        return;
      }

      setIsSubsidiesLoading(true);
      try {
        // Load subsidies and providers in parallel
        const [subsidiesResponse, providers] = await Promise.all([
          getCustomerSubsidies(customerId, user.Jwt),
          getSubsidyProviders(user.Jwt).catch(() => []), // Don't fail if providers can't be loaded
        ]);

        setSubsidies(subsidiesResponse.data || []);
        setSubsidyProviders(providers);
      } catch (error) {
        console.error("Error loading subsidy data:", error);
        setSubsidies([]);
      } finally {
        setIsSubsidiesLoading(false);
      }
    },
    [user?.Jwt]
  );

  const loadWaiverData = useCallback(
    async (customerId: string) => {
      if (!customerId || !user?.Jwt) {
        return;
      }

      setIsWaiversLoading(true);
      try {
        const waiversData = await getCustomerWaivers(customerId, user.Jwt);
        setWaivers(waiversData);
      } catch (error) {
        console.error("Error loading waiver data:", error);
        setWaivers([]);
      } finally {
        setIsWaiversLoading(false);
      }
    },
    [user?.Jwt]
  );

  const loadPaymentTransactions = useCallback(
    async (
      customerId: string,
      pagination: { limit?: number; offset?: number } = {}
    ) => {
      if (!customerId || !user?.Jwt) {
        return;
      }

      const limitToUse =
        typeof pagination.limit === "number" && Number.isFinite(pagination.limit)
          ? pagination.limit
          : paymentsPagination.limit;
      const offsetToUse =
        typeof pagination.offset === "number" &&
        Number.isFinite(pagination.offset)
          ? pagination.offset
          : paymentsPagination.offset;

      setIsPaymentsLoading(true);
      setPaymentsError(null);

      try {
        const result = await getCustomerPaymentTransactions(
          customerId,
          user.Jwt,
          { limit: limitToUse, offset: offsetToUse }
        );
        setPaymentTransactions(result.data);
        setTotalPayments(result.total);
      } catch (error) {
        console.error("Error loading payment transactions:", error);
        setPaymentTransactions([]);
        setTotalPayments(0);
        setPaymentsError(
          error instanceof Error
            ? error.message
            : "Failed to load payment transactions."
        );
      } finally {
        setIsPaymentsLoading(false);
      }
    },
    [paymentsPagination.limit, paymentsPagination.offset, user?.Jwt]
  );

  const handleUploadWaiver = async () => {
    if (!currentCustomer.id || !user?.Jwt) {
      toast({
        status: "error",
        description: "Missing customer ID or authentication",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWaiverFile) {
      toast({
        status: "error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingWaiver(true);
    try {
      await uploadCustomerWaiver(
        currentCustomer.id,
        selectedWaiverFile,
        waiverNotes.trim() || undefined,
        user.Jwt
      );

      await loadWaiverData(currentCustomer.id);

      toast({
        status: "success",
        description: "Waiver uploaded successfully",
      });

      setUploadWaiverDialogOpen(false);
      setSelectedWaiverFile(null);
      setWaiverNotes("");
      if (waiverFileInputRef.current) {
        waiverFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading waiver:", error);
      toast({
        status: "error",
        description:
          error instanceof Error ? error.message : "Failed to upload waiver",
        variant: "destructive",
      });
    } finally {
      setIsUploadingWaiver(false);
    }
  };

  const handleDeleteWaiver = async () => {
    if (!waiverToDelete || !user?.Jwt) {
      toast({
        status: "error",
        description: "Missing waiver or authentication",
        variant: "destructive",
      });
      return;
    }

    setIsDeletingWaiver(true);
    try {
      await deleteCustomerWaiver(waiverToDelete.id, user.Jwt);

      await loadWaiverData(currentCustomer.id);

      toast({
        status: "success",
        description: "Waiver deleted successfully",
      });

      setDeleteWaiverDialogOpen(false);
      setWaiverToDelete(null);
    } catch (error) {
      console.error("Error deleting waiver:", error);
      toast({
        status: "error",
        description:
          error instanceof Error ? error.message : "Failed to delete waiver",
        variant: "destructive",
      });
    } finally {
      setIsDeletingWaiver(false);
    }
  };

  const loadMembershipPlanDetails = useCallback(async (planId: string) => {
    if (!planId) {
      setMembershipPlan(null);
      return;
    }

    setIsMembershipLoading(true);
    try {
      const allPlans = await getAllMembershipPlans();
      const plan = allPlans.find((p) => p.id === planId);
      setMembershipPlan(plan || null);
    } catch (error) {
      console.error("Error loading membership plan details:", error);
      setMembershipPlan(null);
    } finally {
      setIsMembershipLoading(false);
    }
  }, []);

  const loadSubsidyProviders = useCallback(async () => {
    if (!user?.Jwt) {
      return;
    }

    setIsLoadingProviders(true);
    try {
      const providers = await getSubsidyProviders(user.Jwt, true); // Get only active providers
      setSubsidyProviders(providers);
    } catch (error) {
      console.error("Error loading subsidy providers:", error);
      setSubsidyProviders([]);
      toast({
        status: "error",
        description: "Failed to load subsidy providers",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProviders(false);
    }
  }, [user?.Jwt, toast]);

  const handleCreateSubsidy = async () => {
    if (!currentCustomer.id || !user?.Jwt) {
      toast({
        status: "error",
        description: "Missing customer ID or authentication",
        variant: "destructive",
      });
      return;
    }

    if (!newSubsidyProviderId) {
      toast({
        status: "error",
        description: "Please select a provider",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(newSubsidyAmount);
    if (!newSubsidyAmount || isNaN(amount) || amount <= 0) {
      toast({
        status: "error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!newSubsidyReason.trim() || newSubsidyReason.trim().length < 5) {
      toast({
        status: "error",
        description: "Please provide a reason (at least 5 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingSubsidy(true);
    try {
      // Convert date to ISO string if provided
      let validUntilDate = null;
      if (newSubsidyValidUntil) {
        // Create date at end of day in local timezone
        const dateObj = new Date(newSubsidyValidUntil + "T23:59:59");
        validUntilDate = dateObj.toISOString();
      }

      await createSubsidy(
        {
          customer_id: currentCustomer.id,
          provider_id: newSubsidyProviderId,
          approved_amount: amount,
          reason: newSubsidyReason.trim(),
          valid_until: validUntilDate,
          admin_notes: newSubsidyAdminNotes.trim() || null,
        },
        user.Jwt
      );

      await loadSubsidyData(currentCustomer.id);

      toast({
        status: "success",
        description: "Subsidy created successfully",
      });

      // Reset form
      setCreateSubsidyDialogOpen(false);
      setNewSubsidyProviderId("");
      setNewSubsidyAmount("");
      setNewSubsidyReason("");
      setNewSubsidyValidUntil("");
      setNewSubsidyAdminNotes("");
    } catch (error) {
      console.error("Error creating subsidy:", error);
      toast({
        status: "error",
        description:
          error instanceof Error ? error.message : "Failed to create subsidy",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSubsidy(false);
    }
  };

  const getProviderName = (subsidy: Subsidy): string => {
    // Use the provider from the subsidy object if available (new structure)
    if (subsidy.provider?.name) {
      return subsidy.provider.name;
    }
    // Fallback to looking up from providers list (for compatibility)
    if (subsidy.provider?.id) {
      const provider = subsidyProviders.find(
        (p) => p.id === subsidy.provider?.id
      );
      return provider?.name || "Unknown Provider";
    }
    return "Unknown Provider";
  };

  const openDeactivateDialog = (subsidy: Subsidy) => {
    setSubsidyToDeactivate(subsidy);
    setDeactivationReason("");
    setDeactivateSubsidyDialogOpen(true);
  };

  const handleDeactivateSubsidy = async () => {
    if (!subsidyToDeactivate || !user?.Jwt) {
      toast({
        status: "error",
        description: "Missing subsidy or authentication",
        variant: "destructive",
      });
      return;
    }

    if (!deactivationReason.trim() || deactivationReason.trim().length < 5) {
      toast({
        status: "error",
        description: "Please provide a reason (at least 5 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsDeactivating(true);
    try {
      await deactivateSubsidy(
        subsidyToDeactivate.id,
        {
          reason: deactivationReason.trim(),
        },
        user.Jwt
      );

      await loadSubsidyData(currentCustomer.id);

      toast({
        status: "success",
        description: "Subsidy deactivated successfully",
      });

      setDeactivateSubsidyDialogOpen(false);
      setSubsidyToDeactivate(null);
      setDeactivationReason("");
    } catch (error) {
      console.error("Error deactivating subsidy:", error);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to deactivate subsidy",
        variant: "destructive",
      });
    } finally {
      setIsDeactivating(false);
    }
  };

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

  // Reset payment transactions when customer changes
  useEffect(() => {
    setPaymentTransactions([]);
    setPaymentsError(null);
    setPaymentsPagination((prev) =>
      prev.offset === 0 ? prev : { ...prev, offset: 0 }
    );
  }, [customer.id]);

  // Load payment transactions when pagination changes or tab is selected
  useEffect(() => {
    if (currentCustomer.id && tabValue === "payments") {
      loadPaymentTransactions(currentCustomer.id, paymentsPagination);
    }
  }, [
    currentCustomer.id,
    paymentsPagination,
    tabValue,
    loadPaymentTransactions,
  ]);

  useEffect(() => {
    // Update currentCustomer when the customer prop changes
    setCurrentCustomer(customer);
    setNotesDraft(customer.notes ?? "");

    // Load full membership plan details if customer has a membership
    if (customer.membership_plan_id) {
      loadMembershipPlanDetails(customer.membership_plan_id);
    } else {
      setMembershipPlan(null);
    }
  }, [customer, loadMembershipPlanDetails]);

  const refreshCustomerData = async () => {
    if (!customer.id) return;

    setIsLoading(true);
    try {
      // Use the unified getCustomerById function to get all data
      const refreshedCustomer = await getCustomerById(customer.id);
      if (refreshedCustomer) {
        setCurrentCustomer(refreshedCustomer);
        setNotesDraft(refreshedCustomer.notes ?? "");

        // Load membership plan details if available
        if (refreshedCustomer.membership_plan_id) {
          await loadMembershipPlanDetails(refreshedCustomer.membership_plan_id);
        } else {
          setMembershipPlan(null);
        }
        await Promise.all([
          loadCustomerCredits(refreshedCustomer.id),
          loadSuspensionData(refreshedCustomer.id),
          loadSubsidyData(refreshedCustomer.id),
          loadWaiverData(refreshedCustomer.id),
          fetchTransactions(refreshedCustomer.id, {
            limit: transactionsLimit,
            offset: transactionsOffset,
          }),
          loadPaymentTransactions(refreshedCustomer.id, {
            limit: paymentsPagination.limit,
            offset: 0,
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

  const hasNotesChanged = notesDraft !== (currentCustomer.notes ?? "");
  const maxNotesLength = 5000;

  const handleSaveNotes = async () => {
    if (!currentCustomer.id) {
      toast({
        status: "error",
        description: "Customer ID is missing",
        variant: "destructive",
      });
      return;
    }

    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be signed in to update notes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSavingNotes(true);
      await updateCustomerNotes(currentCustomer.id, notesDraft, user.Jwt);
      setCurrentCustomer((prev) => ({ ...prev, notes: notesDraft }));
      onCustomerUpdatedRef.current?.({ notes: notesDraft });
      toast({
        status: "success",
        description: "Customer notes updated",
      });
    } catch (error) {
      console.error("Failed to update customer notes:", error);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update customer notes",
        variant: "destructive",
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

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

    loadSuspensionData(customer.id);
  }, [customer.id, loadSuspensionData]);

  useEffect(() => {
    if (!customer.id) {
      return;
    }

    loadSubsidyData(customer.id);
  }, [customer.id, loadSubsidyData]);

  useEffect(() => {
    if (!customer.id) {
      return;
    }

    loadWaiverData(customer.id);
  }, [customer.id, loadWaiverData]);

  useEffect(() => {
    if (!customer.id) {
      return;
    }

    void fetchTransactions(customer.id, {
      limit: transactionsLimit,
      offset: transactionsOffset,
    });
  }, [customer.id, fetchTransactions, transactionsLimit, transactionsOffset]);

  useEffect(() => {
    if (createSubsidyDialogOpen) {
      loadSubsidyProviders();
    }
  }, [createSubsidyDialogOpen, loadSubsidyProviders]);

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

  const handleSuspend = async () => {
    if (!currentCustomer.id || !user?.Jwt) {
      toast({
        status: "error",
        description: "Missing customer ID or authentication",
        variant: "destructive",
      });
      return;
    }

    if (!suspensionReason.trim() || suspensionReason.trim().length < 10) {
      toast({
        status: "error",
        description:
          "Please provide a suspension reason (at least 10 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsSuspending(true);
    try {
      const apiClient = new Api<{ token: string }>({
        baseUrl: getValue("API").replace(/\/$/, ""),
        securityWorker: (securityData) =>
          securityData?.token
            ? { headers: { Authorization: `Bearer ${securityData.token}` } }
            : {},
      });
      apiClient.setSecurityData({ token: user.Jwt });

      await apiClient.customers.suspendUser(currentCustomer.id, {
        suspension_reason: suspensionReason.trim(),
        suspension_duration: suspensionDuration.trim() || null,
      });

      await loadSuspensionData(currentCustomer.id);

      toast({
        status: "success",
        description: "Customer suspended successfully",
      });

      setSuspendDialogOpen(false);
      setSuspensionReason("");
      setSuspensionDuration("");
    } catch (error) {
      console.error("Error suspending customer:", error);
      toast({
        status: "error",
        description:
          error instanceof Error ? error.message : "Failed to suspend customer",
        variant: "destructive",
      });
    } finally {
      setIsSuspending(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!currentCustomer.id || !user?.Jwt) {
      toast({
        status: "error",
        description: "Missing customer ID or authentication",
        variant: "destructive",
      });
      return;
    }

    setIsSuspending(true);
    try {
      const apiClient = new Api<{ token: string }>({
        baseUrl: getValue("API").replace(/\/$/, ""),
        securityWorker: (securityData) =>
          securityData?.token
            ? { headers: { Authorization: `Bearer ${securityData.token}` } }
            : {},
      });
      apiClient.setSecurityData({ token: user.Jwt });

      await apiClient.customers.unsuspendUser(currentCustomer.id, {
        collect_arrears: collectArrears,
        extend_membership: extendMembership,
      });

      await loadSuspensionData(currentCustomer.id);

      toast({
        status: "success",
        description: "Customer unsuspended successfully",
      });

      setUnsuspendDialogOpen(false);
      setCollectArrears(false);
      setExtendMembership(false);
    } catch (error) {
      console.error("Error unsuspending customer:", error);
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to unsuspend customer",
        variant: "destructive",
      });
    } finally {
      setIsSuspending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Deletion Warning Banner */}
      {currentCustomer.deleted_at && (
        <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Account Deletion Requested</AlertTitle>
          <AlertDescription>
            <p>This customer has requested account deletion.</p>
            <p className="mt-1">
              <strong>Deleted:</strong>{" "}
              {new Date(currentCustomer.deleted_at).toLocaleString()}
            </p>
            {currentCustomer.scheduled_deletion_at && (
              <p>
                <strong>Permanent deletion scheduled:</strong>{" "}
                {new Date(currentCustomer.scheduled_deletion_at).toLocaleString()}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

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
            <TabsTrigger
              value="notes"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="waivers"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <File className="h-4 w-4" />
              Waivers
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <Receipt className="h-4 w-4" />
              Payments
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
          {isMembershipLoading ? (
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">
                  Loading membership details...
                </div>
              </CardContent>
            </Card>
          ) : currentCustomer.memberships && currentCustomer.memberships.length > 0 ? (
            <div className="space-y-4">
              {currentCustomer.memberships.map((membership, index) => {
                const isPastDue = membership.subscription_status === "past_due";
                return (
                <Card key={membership.membership_plan_id || index} className={`border-l-4 ${isPastDue ? "border-l-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-l-yellow-500"}`}>
                  <CardContent className="pt-6">
                    {isPastDue && (
                      <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-700 dark:text-red-300">Payment Past Due</p>
                          <p className="text-xs text-red-600 dark:text-red-400">This membership has an outstanding payment that needs to be collected.</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className={`h-5 w-5 ${isPastDue ? "text-red-500" : "text-yellow-500"}`} />
                      <h3 className="font-semibold text-lg">
                        {membership.membership_name}
                      </h3>
                      {isPastDue && (
                        <Badge variant="destructive" className="animate-pulse">
                          Past Due
                        </Badge>
                      )}
                      {currentCustomer.memberships.length > 1 && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({index + 1} of {currentCustomer.memberships.length})
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Plan Name
                        </label>
                        <p className="text-sm font-medium">
                          {membership.membership_plan_name || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Status
                        </label>
                        <div className="flex items-center gap-2">
                          {membership.subscription_status === "past_due" ? (
                            <Badge variant="destructive" className="text-xs">
                              Past Due
                            </Badge>
                          ) : membership.subscription_status === "canceled" ? (
                            <Badge variant="secondary" className="text-xs">
                              Canceled
                            </Badge>
                          ) : membership.subscription_status === "inactive" ? (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          ) : membership.subscription_status === "expired" ? (
                            <Badge variant="outline" className="text-xs">
                              Expired
                            </Badge>
                          ) : (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Started
                        </label>
                        <p className="text-sm font-medium">
                          {membership.membership_start_date
                            ? new Date(
                                membership.membership_start_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Renewal
                        </label>
                        <p className="text-sm font-medium">
                          {membership.membership_renewal_date
                            ? new Date(
                                membership.membership_renewal_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      {membershipPlan && membershipPlan.id === membership.membership_plan_id && (
                        <>
                          {membershipPlan.credit_allocation !== null &&
                            membershipPlan.credit_allocation !== undefined && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                  Credit Allocation
                                </label>
                                <p className="text-sm font-medium">
                                  {membershipPlan.credit_allocation} credits
                                </p>
                              </div>
                            )}
                          {membershipPlan.weekly_credit_limit !== null &&
                            membershipPlan.weekly_credit_limit !== undefined && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                  Weekly Credit Limit
                                </label>
                                <p className="text-sm font-medium">
                                  {membershipPlan.weekly_credit_limit} credits/week
                                </p>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          ) : (
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="p-8 text-center">
                  <div className="mb-4">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No Membership Information
                  </h3>
                  <p className="text-muted-foreground">
                    This customer doesn&apos;t have any membership plans associated
                    with their account.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Help - Collapsible */}
          <Collapsible className="mt-4">
            <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full group">
              <Info className="h-3.5 w-3.5 text-blue-500" />
              <span>Customer saying they see funds were taken from their account?</span>
              <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3 space-y-1.5">
                <p><strong>Pending charges from failed/blocked payments:</strong> No funds were withdrawn. The hold disappears in 3-5 business days.</p>
                <p><strong>Blocked by fraud prevention:</strong> Card wasn&apos;t charged. Bank authorization auto-releases.</p>
                <p><strong>Bank declined:</strong> No payment processed. Customer should contact their bank if it persists beyond a week.</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Subsidies Card */}
          <Card
            className={`border-l-4 mt-4 ${subsidies.length > 0 && subsidies.some((s) => s.status === "active") ? "border-l-green-500" : "border-l-yellow-500"}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HandCoins
                    className={`h-5 w-5 ${subsidies.length > 0 && subsidies.some((s) => s.status === "active") ? "text-green-500" : "text-yellow-500"}`}
                  />
                  <h3 className="font-semibold text-lg">Subsidies</h3>
                </div>
                <Button
                  onClick={() => setCreateSubsidyDialogOpen(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subsidy
                </Button>
              </div>
              {isSubsidiesLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading subsidy data...
                </div>
              ) : subsidies.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {subsidies.map((subsidy) => (
                      <div
                        key={subsidy.id}
                        className={`p-3 rounded-md border relative ${
                          subsidy.status === "active"
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                            : subsidy.status === "depleted"
                              ? "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
                              : subsidy.status === "expired" ||
                                  subsidy.status === "revoked"
                                ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                                : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                        }`}
                      >
                        {/* Deactivate button - only show for active, pending, or approved subsidies */}
                        {(subsidy.status === "active" ||
                          subsidy.status === "pending" ||
                          subsidy.status === "approved") && (
                          <Button
                            onClick={() => openDeactivateDialog(subsidy)}
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 text-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                          >
                            Deactivate
                          </Button>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Provider
                            </label>
                            <p className="text-sm font-medium">
                              {getProviderName(subsidy)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Status
                            </label>
                            <p className="text-sm font-medium capitalize">
                              {subsidy.status}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Remaining Balance
                            </label>
                            <p className="text-sm font-medium">
                              ${subsidy.remaining_balance.toFixed(2)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Approved Amount
                            </label>
                            <p className="text-sm font-medium">
                              ${subsidy.approved_amount.toFixed(2)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Total Used
                            </label>
                            <p className="text-sm font-medium">
                              ${subsidy.total_amount_used?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Valid From
                            </label>
                            <p className="text-sm font-medium">
                              {subsidy.valid_from
                                ? new Date(
                                    subsidy.valid_from
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Valid Until
                            </label>
                            <p className="text-sm font-medium">
                              {subsidy.valid_until
                                ? new Date(
                                    subsidy.valid_until
                                  ).toLocaleDateString()
                                : "No expiration"}
                            </p>
                          </div>
                          {subsidy.approved_by && (
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">
                                Approved By
                              </label>
                              <p className="text-sm font-medium">
                                {subsidy.approved_by}
                              </p>
                            </div>
                          )}
                          {subsidy.approved_at && (
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">
                                Approved At
                              </label>
                              <p className="text-sm font-medium">
                                {new Date(
                                  subsidy.approved_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {subsidy.reason && (
                            <div className="col-span-2 space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">
                                Reason
                              </label>
                              <p className="text-sm">{subsidy.reason}</p>
                            </div>
                          )}
                          {subsidy.admin_notes && (
                            <div className="col-span-2 space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">
                                Admin Notes
                              </label>
                              <p className="text-sm text-muted-foreground italic">
                                {subsidy.admin_notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 text-xs text-muted-foreground">
                    Total active subsidies:{" "}
                    {subsidies.filter((s) => s.status === "active").length} of{" "}
                    {subsidies.length}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    This customer does not have any subsidies.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suspension Card */}
          <Card
            className={`border-l-4 mt-4 ${suspensionData?.is_suspended ? "border-l-red-500" : "border-l-yellow-500"}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Ban
                  className={`h-5 w-5 ${suspensionData?.is_suspended ? "text-red-500" : "text-yellow-500"}`}
                />
                <h3 className="font-semibold text-lg">Suspension Status</h3>
              </div>
              {isSuspensionLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading suspension data...
                </div>
              ) : suspensionData?.is_suspended ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <p className="text-sm font-medium text-red-600">
                        Suspended
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Suspended At
                      </label>
                      <p className="text-sm font-medium">
                        {suspensionData.suspended_at
                          ? new Date(
                              suspensionData.suspended_at
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Suspended By
                      </label>
                      <p className="text-sm font-medium">
                        {suspensionData.suspended_by || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Expires At
                      </label>
                      <p className="text-sm font-medium">
                        {suspensionData.suspension_expires_at
                          ? new Date(
                              suspensionData.suspension_expires_at
                            ).toLocaleString()
                          : "Indefinite"}
                      </p>
                    </div>
                    {suspensionData.suspension_reason && (
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Reason
                        </label>
                        <p className="text-sm font-medium">
                          {suspensionData.suspension_reason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => setUnsuspendDialogOpen(true)}
                      disabled={isSuspending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Unsuspend Customer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    This customer is not currently suspended.
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => setSuspendDialogOpen(true)}
                      disabled={isSuspending}
                      variant="destructive"
                    >
                      Suspend Customer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Customer Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep important details about this customer in one place.
                      </p>
                    </div>
                  </div>
                  {!isReceptionist && (
                    <Button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={!hasNotesChanged || isSavingNotes}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      {isSavingNotes ? "Saving..." : "Save Notes"}
                    </Button>
                  )}
                </div>
                <Textarea
                  value={notesDraft}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (!NOTES_INPUT_PATTERN.test(value)) {
                      return;
                    }
                    setNotesDraft(value);
                  }}
                  placeholder="No notes"
                  className="min-h-[200px] bg-background"
                  maxLength={maxNotesLength}
                  disabled={isSavingNotes || isReceptionist}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {notesDraft.length}/{maxNotesLength} characters
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waivers">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold text-lg">Waiver Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage waiver and consent documents for this customer.
                    </p>
                  </div>
                </div>
                {!isReceptionist && (
                  <Button
                    onClick={() => setUploadWaiverDialogOpen(true)}
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Waiver
                  </Button>
                )}
              </div>
              {isWaiversLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading waivers...
                </div>
              ) : waivers.length > 0 ? (
                <div className="space-y-3">
                  {waivers.map((waiver) => (
                    <div
                      key={waiver.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-medium text-sm">
                            {waiver.file_name || "Waiver Document"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded:{" "}
                            {(() => {
                              const timestamp: string | undefined = typeof waiver.uploaded_at === 'object' && waiver.uploaded_at?.Time
                                ? waiver.uploaded_at.Time
                                : typeof waiver.uploaded_at === 'string' ? waiver.uploaded_at : undefined;
                              return timestamp && !isNaN(new Date(timestamp).getTime())
                                ? new Date(timestamp).toLocaleDateString()
                                : "Recently";
                            })()}
                            {waiver.file_size &&
                              ` • ${(waiver.file_size / 1024).toFixed(1)} KB`}
                          </p>
                          {waiver.notes && (
                            <p className="text-xs text-muted-foreground italic mt-1">
                              {waiver.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {waiver.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(waiver.file_url, "_blank")
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        {!isReceptionist && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setWaiverToDelete(waiver);
                              setDeleteWaiverDialogOpen(true);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mb-4">
                    <File className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No Waivers Uploaded
                  </h3>
                  <p className="text-muted-foreground">
                    This customer doesn't have any waiver documents uploaded
                    yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits">
          <div className="space-y-6">
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="h-8 w-8 text-yellow-500" />
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
                  Manage this customer's available credits by adding or
                  deducting amounts below.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Add Credits</h3>
                      <p className="text-sm text-muted-foreground">
                        Increase the customer's available credits.
                      </p>
                    </div>
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
                          onChange={(event) => {
                            const { value } = event.target;
                            if (!CREDITS_AMOUNT_PATTERN.test(value)) {
                              return;
                            }

                            setAddCreditsAmount(value);
                          }}
                          disabled={creditsAction !== null}
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                        onClick={() => handleCreditMutation("add")}
                        disabled={isAddDisabled}
                      >
                        {creditsAction === "add" ? "Adding..." : "Add"}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="add-credits-description">
                        Description
                      </Label>
                      <Textarea
                        id="add-credits-description"
                        placeholder="Describe the reason for adding credits"
                        value={addCreditsDescription}
                        onChange={(event) => {
                          const { value } = event.target;
                          if (!NOTES_INPUT_PATTERN.test(value)) {
                            return;
                          }

                          setAddCreditsDescription(value);
                        }}
                        disabled={creditsAction !== null || isReceptionist}
                        rows={3}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Deduct Credits</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduce the customer's available credits.
                      </p>
                    </div>
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
                          onChange={(event) => {
                            const { value } = event.target;
                            if (!CREDITS_AMOUNT_PATTERN.test(value)) {
                              return;
                            }

                            setDeductCreditsAmount(value);
                          }}
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
                        onChange={(event) => {
                          const { value } = event.target;
                          if (!NOTES_INPUT_PATTERN.test(value)) {
                            return;
                          }

                          setDeductCreditsDescription(value);
                        }}
                        disabled={creditsAction !== null || isReceptionist}
                        rows={3}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Credit History</h3>
                      <p className="text-sm text-muted-foreground">
                        Review the most recent credit adjustments applied to
                        this account.
                      </p>
                    </div>
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
                    <div className="p-8 text-center">
                      <div className="mb-4">
                        <Coins className="h-12 w-12 mx-auto text-muted-foreground/40" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        No Credit History
                      </h3>
                      <p className="text-muted-foreground">
                        This customer hasn't had any credit transactions yet.
                        Credit additions and deductions will appear here.
                      </p>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-lg">Payment History</h3>
                    <p className="text-sm text-muted-foreground">
                      View all payment transactions for this customer.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isPaymentsLoading && (
                    <span className="text-xs text-muted-foreground">
                      Loading...
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="payment-page-size"
                      className="text-sm text-muted-foreground"
                    >
                      Rows per page
                    </Label>
                    <select
                      id="payment-page-size"
                      className="h-9 rounded-md border bg-background px-2 text-sm"
                      value={paymentsPagination.limit}
                      onChange={(event) => {
                        const nextLimit = Number(event.target.value);
                        setPaymentsPagination({
                          limit:
                            Number.isFinite(nextLimit) && nextLimit > 0
                              ? nextLimit
                              : 10,
                          offset: 0,
                        });
                      }}
                      disabled={isPaymentsLoading}
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
                {isPaymentsLoading && paymentTransactions.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Loading payment transactions...
                  </div>
                ) : paymentsError ? (
                  <div className="p-6 text-center space-y-4">
                    <p className="text-sm text-destructive">{paymentsError}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        loadPaymentTransactions(
                          currentCustomer.id,
                          paymentsPagination
                        )
                      }
                      disabled={isPaymentsLoading}
                    >
                      Try again
                    </Button>
                  </div>
                ) : paymentTransactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mb-4">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No Payment History
                    </h3>
                    <p className="text-muted-foreground">
                      This customer hasn&apos;t made any payments yet.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="cursor-default hover:bg-transparent">
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentTransactions.map((transaction) => {
                        const transactionDate = new Date(
                          transaction.transaction_date
                        );
                        const formattedDate = Number.isNaN(
                          transactionDate.getTime()
                        )
                          ? transaction.transaction_date
                          : transactionDate.toLocaleDateString();

                        const formattedAmount = new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(transaction.customer_paid);

                        const typeLabels: Record<string, string> = {
                          event_registration: "Event Registration",
                          program_enrollment: "Program Enrollment",
                          credit_package: "Credit Package",
                          membership_subscription: "Membership",
                          membership_renewal: "Membership Renewal",
                        };

                        const statusStyles: Record<string, string> = {
                          pending: "bg-yellow-100 text-yellow-800",
                          processing: "bg-blue-100 text-blue-800",
                          success: "bg-green-100 text-green-800",
                          completed: "bg-green-100 text-green-800",
                          failed: "bg-red-100 text-red-800",
                          refunded: "bg-gray-100 text-gray-800",
                        };

                        // Determine which URLs to use - prefer invoice for memberships, receipt for others
                        // but fall back to whatever is available
                        const isMembershipType = [
                          "membership_subscription",
                          "membership_renewal",
                        ].includes(transaction.transaction_type);

                        // Use whichever URL is available, with preference based on transaction type
                        const primaryUrl = isMembershipType
                          ? (transaction.invoice_url || transaction.receipt_url)
                          : (transaction.receipt_url || transaction.invoice_url);

                        // Show PDF download if invoice_pdf_url exists (regardless of transaction type)
                        const pdfUrl = transaction.invoice_pdf_url;

                        // Determine the label based on which URL we're actually using
                        const isUsingInvoiceUrl = primaryUrl === transaction.invoice_url;

                        return (
                          <TableRow
                            key={transaction.id}
                            className="cursor-default hover:bg-transparent"
                          >
                            <TableCell className="whitespace-nowrap">
                              {formattedDate}
                            </TableCell>
                            <TableCell>
                              {typeLabels[transaction.transaction_type] ||
                                transaction.transaction_type}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formattedAmount}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${
                                  statusStyles[transaction.payment_status] ||
                                  statusStyles.pending
                                } capitalize font-medium`}
                              >
                                {transaction.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-accent"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="border bg-popover text-popover-foreground"
                                >
                                  <DropdownMenuLabel className="px-3 py-2">
                                    Actions
                                  </DropdownMenuLabel>
                                  {primaryUrl && typeof primaryUrl === "string" && (
                                    <DropdownMenuItem
                                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        window.open(primaryUrl, "_blank", "noopener,noreferrer");
                                      }}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      {isUsingInvoiceUrl
                                        ? "View Invoice"
                                        : "View Receipt"}
                                    </DropdownMenuItem>
                                  )}
                                  {pdfUrl && typeof pdfUrl === "string" && (
                                    <DropdownMenuItem
                                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        window.open(pdfUrl, "_blank", "noopener,noreferrer");
                                      }}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Download PDF
                                    </DropdownMenuItem>
                                  )}
                                  {primaryUrl && typeof primaryUrl === "string" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="px-3 py-2 hover:bg-accent cursor-pointer"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          navigator.clipboard.writeText(primaryUrl);
                                          toast({
                                            status: "success",
                                            description:
                                              "URL copied to clipboard",
                                          });
                                        }}
                                      >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy URL
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {(!primaryUrl || typeof primaryUrl !== "string") &&
                                    (!pdfUrl || typeof pdfUrl !== "string") && (
                                    <DropdownMenuItem
                                      disabled
                                      className="px-3 py-2 text-muted-foreground"
                                    >
                                      No receipt available
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Pagination controls */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {paymentTransactions.length > 0
                    ? `Showing ${paymentsPagination.offset + 1}–${Math.min(
                        paymentsPagination.offset + paymentTransactions.length,
                        totalPayments
                      )} of ${totalPayments}`
                    : "No transactions"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPaymentsPagination((prev) => ({
                        ...prev,
                        offset: Math.max(0, prev.offset - prev.limit),
                      }))
                    }
                    disabled={
                      paymentsPagination.offset === 0 || isPaymentsLoading
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPaymentsPagination((prev) => ({
                        ...prev,
                        offset: prev.offset + prev.limit,
                      }))
                    }
                    disabled={
                      paymentsPagination.offset + paymentsPagination.limit >=
                        totalPayments || isPaymentsLoading
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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

      <div className="sticky -bottom-10 bg-background pt-4 pb-14 border-t z-10 mt-8 -mx-10 px-10">
        <div className="max-w-full mx-auto px-2 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated:{" "}
            {currentCustomer.updated_at
              ? new Date(currentCustomer.updated_at).toLocaleString()
              : "Never"}
          </p>

          {!isReceptionist && (
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
          )}
        </div>
      </div>

      {/* Suspend Dialog */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Suspending this customer will pause their membership and access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspension-reason">
                Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="suspension-reason"
                placeholder="Enter the reason for suspension (10-500 characters)"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
                disabled={isSuspending}
              />
              <p className="text-xs text-muted-foreground">
                {suspensionReason.length}/500 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspension-duration">Duration (Optional)</Label>
              <Input
                id="suspension-duration"
                placeholder="e.g., 720h (30 days), 168h (1 week), 8760h (1 year)"
                value={suspensionDuration}
                onChange={(e) => setSuspensionDuration(e.target.value)}
                disabled={isSuspending}
              />
              <p className="text-xs text-muted-foreground">
                Enter duration in hours (e.g., 24h, 168h, 720h) or leave empty
                for indefinite
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleSuspend}
              disabled={isSuspending || suspensionReason.trim().length < 10}
              variant="destructive"
            >
              {isSuspending ? "Suspending..." : "Suspend Customer"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unsuspend Dialog */}
      <AlertDialog
        open={unsuspendDialogOpen}
        onOpenChange={setUnsuspendDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsuspend Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Reactivate this customer's membership and access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="collect-arrears"
                checked={collectArrears}
                onCheckedChange={(checked) =>
                  setCollectArrears(checked as boolean)
                }
                disabled={isSuspending}
              />
              <Label
                htmlFor="collect-arrears"
                className="text-sm font-normal cursor-pointer"
              >
                Collect arrears (charge for suspended period)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="extend-membership"
                checked={extendMembership}
                onCheckedChange={(checked) =>
                  setExtendMembership(checked as boolean)
                }
                disabled={isSuspending}
              />
              <Label
                htmlFor="extend-membership"
                className="text-sm font-normal cursor-pointer"
              >
                Extend membership by suspension duration
              </Label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleUnsuspend}
              disabled={isSuspending}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSuspending ? "Unsuspending..." : "Unsuspend Customer"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Subsidy Dialog */}
      <AlertDialog
        open={createSubsidyDialogOpen}
        onOpenChange={setCreateSubsidyDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Subsidy</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new subsidy for this customer. Subsidies provide
              financial assistance for services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subsidy-provider">
                Provider <span className="text-destructive">*</span>
              </Label>
              {isLoadingProviders ? (
                <div className="text-sm text-muted-foreground">
                  Loading providers...
                </div>
              ) : subsidyProviders.length === 0 ? (
                <div className="text-sm text-destructive">
                  No active providers available
                </div>
              ) : (
                <Select
                  value={newSubsidyProviderId}
                  onValueChange={setNewSubsidyProviderId}
                  disabled={isCreatingSubsidy}
                >
                  <SelectTrigger id="subsidy-provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {subsidyProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subsidy-amount">
                Approved Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subsidy-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount (e.g., 100.00)"
                value={newSubsidyAmount}
                onChange={(e) => setNewSubsidyAmount(e.target.value)}
                disabled={isCreatingSubsidy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subsidy-reason">
                Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="subsidy-reason"
                placeholder="Enter the reason for this subsidy (5-500 characters)"
                value={newSubsidyReason}
                onChange={(e) => setNewSubsidyReason(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
                disabled={isCreatingSubsidy}
              />
              <p className="text-xs text-muted-foreground">
                {newSubsidyReason.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subsidy-valid-until">
                Valid Until (Optional)
              </Label>
              <Input
                id="subsidy-valid-until"
                type="date"
                value={newSubsidyValidUntil}
                onChange={(e) => setNewSubsidyValidUntil(e.target.value)}
                disabled={isCreatingSubsidy}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for no expiration date
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subsidy-admin-notes">
                Admin Notes (Optional)
              </Label>
              <Textarea
                id="subsidy-admin-notes"
                placeholder="Internal notes about this subsidy (max 1000 characters)"
                value={newSubsidyAdminNotes}
                onChange={(e) => setNewSubsidyAdminNotes(e.target.value)}
                className="min-h-[80px]"
                maxLength={1000}
                disabled={isCreatingSubsidy}
              />
              <p className="text-xs text-muted-foreground">
                {newSubsidyAdminNotes.length}/1000 characters
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreatingSubsidy}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleCreateSubsidy}
              disabled={
                isCreatingSubsidy ||
                !newSubsidyProviderId ||
                !newSubsidyAmount ||
                !newSubsidyReason.trim() ||
                newSubsidyReason.trim().length < 5
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreatingSubsidy ? "Creating..." : "Create Subsidy"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Subsidy Dialog */}
      <AlertDialog
        open={deactivateSubsidyDialogOpen}
        onOpenChange={setDeactivateSubsidyDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Subsidy</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the subsidy and prevent further use. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {subsidyToDeactivate && (
              <div className="p-3 rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Provider:</span>{" "}
                    {getProviderName(subsidyToDeactivate)}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize">
                      {subsidyToDeactivate.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Balance:</span> $
                    {subsidyToDeactivate.remaining_balance.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> $
                    {subsidyToDeactivate.approved_amount.toFixed(2)}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Reason:</span>{" "}
                    {subsidyToDeactivate.reason}
                  </div>
                  {subsidyToDeactivate.admin_notes && (
                    <div className="col-span-2">
                      <span className="font-medium">Admin Notes:</span>{" "}
                      <span className="italic text-muted-foreground">
                        {subsidyToDeactivate.admin_notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="deactivation-reason">
                Deactivation Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="deactivation-reason"
                placeholder="Enter the reason for deactivating this subsidy (5-500 characters)"
                value={deactivationReason}
                onChange={(e) => setDeactivationReason(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
                disabled={isDeactivating}
              />
              <p className="text-xs text-muted-foreground">
                {deactivationReason.length}/500 characters
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDeactivateSubsidy}
              disabled={
                isDeactivating ||
                !deactivationReason.trim() ||
                deactivationReason.trim().length < 5
              }
              variant="destructive"
            >
              {isDeactivating ? "Deactivating..." : "Deactivate Subsidy"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Waiver Dialog */}
      <AlertDialog
        open={uploadWaiverDialogOpen}
        onOpenChange={setUploadWaiverDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upload Waiver</AlertDialogTitle>
            <AlertDialogDescription>
              Upload a signed waiver or consent document for this customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="waiver-file">
                File <span className="text-destructive">*</span>
              </Label>
              <Input
                id="waiver-file"
                type="file"
                ref={waiverFileInputRef}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedWaiverFile(file);
                }}
                disabled={isUploadingWaiver}
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waiver-notes">Notes (Optional)</Label>
              <Textarea
                id="waiver-notes"
                placeholder="Add any notes about this waiver"
                value={waiverNotes}
                onChange={(e) => setWaiverNotes(e.target.value)}
                className="min-h-[80px]"
                maxLength={500}
                disabled={isUploadingWaiver}
              />
              <p className="text-xs text-muted-foreground">
                {waiverNotes.length}/500 characters
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUploadingWaiver}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleUploadWaiver}
              disabled={isUploadingWaiver || !selectedWaiverFile}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              {isUploadingWaiver ? "Uploading..." : "Upload Waiver"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Waiver Dialog */}
      <AlertDialog
        open={deleteWaiverDialogOpen}
        onOpenChange={setDeleteWaiverDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Waiver</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this waiver? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {waiverToDelete && (
            <div className="py-4">
              <div className="p-3 rounded-md border bg-muted/30">
                <p className="font-medium text-sm">
                  {waiverToDelete.file_name || "Waiver Document"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded:{" "}
                  {(() => {
                    const timestamp: string | undefined = typeof waiverToDelete.uploaded_at === 'object' && waiverToDelete.uploaded_at?.Time
                      ? waiverToDelete.uploaded_at.Time
                      : typeof waiverToDelete.uploaded_at === 'string' ? waiverToDelete.uploaded_at : undefined;
                    return timestamp && !isNaN(new Date(timestamp).getTime())
                      ? new Date(timestamp).toLocaleDateString()
                      : "Recently";
                  })()}
                </p>
                {waiverToDelete.notes && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    {waiverToDelete.notes}
                  </p>
                )}
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingWaiver}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDeleteWaiver}
              disabled={isDeletingWaiver}
              variant="destructive"
            >
              {isDeletingWaiver ? "Deleting..." : "Delete Waiver"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
