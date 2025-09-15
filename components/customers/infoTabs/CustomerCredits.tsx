"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import {
  getCustomerCredits,
  addCustomerCredits,
  deductCustomerCredits,
  getCreditTransactions,
} from "@/services/credits";

const NUMERIC_VALUE_KEYS = [
  "Float64",
  "Float32",
  "Int64",
  "Int32",
  "Int16",
  "Int8",
  "Uint64",
  "Uint32",
  "Uint16",
  "Uint8",
  "Number",
];

const COLLECTION_KEYS = ["data", "transactions", "items", "records", "results"];

const unwrapNullableValue = (value: unknown): unknown => {
  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;

  const upperValid = "Valid" in record ? record["Valid"] : undefined;
  if (upperValid === false) {
    return "";
  }

  const lowerValid = "valid" in record ? record["valid"] : undefined;
  if (lowerValid === false) {
    return "";
  }

  const stringValue = "String" in record ? record["String"] : undefined;
  if (typeof stringValue === "string") {
    return stringValue;
  }

  for (const key of NUMERIC_VALUE_KEYS) {
    const numericValue = record[key];
    if (typeof numericValue === "number") {
      return numericValue;
    }
  }

  if ("Value" in record) {
    return unwrapNullableValue(record["Value"]);
  }

  if ("value" in record) {
    return unwrapNullableValue(record["value"]);
  }

  return value;
};

const formatTransactionValue = (value: unknown): string => {
  const resolved = unwrapNullableValue(value);

  if (resolved === null || resolved === undefined) {
    return "";
  }

  if (typeof resolved === "string") {
    return resolved;
  }

  if (typeof resolved === "number" && Number.isFinite(resolved)) {
    return resolved.toString();
  }

  if (typeof resolved === "boolean") {
    return resolved ? "Yes" : "No";
  }

  const serialized = JSON.stringify(resolved);
  return serialized === "{}" || serialized === "[]" ? "" : serialized;
};

const extractTransactionList = (payload: unknown): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;

  for (const key of COLLECTION_KEYS) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === "object") {
      const nestedRecord = value as Record<string, unknown>;
      for (const nestedKey of COLLECTION_KEYS) {
        const nestedValue = nestedRecord[nestedKey];
        if (Array.isArray(nestedValue)) {
          return nestedValue;
        }
      }
    }
  }

  return [];
};

const getTransactionLabel = (transaction: any): string => {
  const candidates = [
    transaction?.type,
    transaction?.description,
    transaction?.note,
    transaction?.reason,
    transaction?.details,
    transaction?.label,
  ];

  for (const candidate of candidates) {
    const formatted = formatTransactionValue(candidate);
    if (formatted) {
      return formatted;
    }
  }

  return "";
};

const getTransactionAmount = (transaction: any): string => {
  const candidates = [
    transaction?.amount,
    transaction?.credits,
    transaction?.credit,
    transaction?.balance_change,
    transaction?.balanceChange,
    transaction?.value,
  ];

  for (const candidate of candidates) {
    const formatted = formatTransactionValue(candidate);
    if (formatted) {
      return formatted;
    }
  }

  return "";
};

interface CustomerCreditsProps {
  customerId: string;
  credits: number;
  onCreditChange?: (credits: number) => void;
}

export default function CustomerCredits({
  customerId,
  credits: initialCredits,
  onCreditChange,
}: CustomerCreditsProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [credits, setCredits] = useState(initialCredits);
  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const limit = 20;

  const jwt = user?.Jwt || "";
  const offset = useMemo(() => page * limit, [page]);

  const trimmedDescription = description.trim();
  const parsedAmount = parseFloat(amount);
  const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const isActionDisabled =
    !jwt || !hasValidAmount || trimmedDescription.length === 0;

  useEffect(() => {
    setCredits(initialCredits);
  }, [initialCredits]);

  useEffect(() => {
    if (!jwt) return;
    const fetchBalance = async () => {
      try {
        setBalanceError(null);
        const balance = await getCustomerCredits(customerId, jwt, {
          includeCustomerId: true,
        });
        setCredits(balance);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to retrieve customer credits";
        setBalanceError(message);
        toast({
          status: "error",
          description: message,
          variant: "destructive",
        });
      }
    };
    fetchBalance();
  }, [customerId, jwt]);

  const loadTransactions = async (offset: number) => {
    if (!jwt) return;
    try {
      setTransactionsError(null);
      setIsLoadingTransactions(true);
      const data = await getCreditTransactions(
        customerId,
        jwt,
        {
          offset,
          limit,
        },
        { includeCustomerId: true }
      );
      setTransactions(extractTransactionList(data));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load credit transactions";
      setTransactions([]);
      setTransactionsError(message);
      toast({
        status: "error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    loadTransactions(offset);
  }, [offset, customerId, jwt]);

  const mutateCredits = async (action: "add" | "deduct") => {
    if (!jwt) return;

    if (!hasValidAmount) {
      toast({
        status: "error",
        description: "Enter a positive amount",
        variant: "destructive",
      });
      return;
    }

    if (!trimmedDescription) {
      toast({
        status: "error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCredits =
        action === "add"
          ? await addCustomerCredits(
              customerId,
              parsedAmount,
              trimmedDescription,
              jwt
            )
          : await deductCustomerCredits(
              customerId,
              parsedAmount,
              trimmedDescription,
              jwt
            );

      setCredits(newCredits);
      setAmount("0");
      setDescription("");
      onCreditChange?.(newCredits);
      toast({
        status: "success",
        description: action === "add" ? "Credits added" : "Credits deducted",
      });
      loadTransactions(offset);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : `Failed to ${action === "add" ? "add" : "deduct"} credits`;
      toast({
        status: "error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleAdd = async () => {
    await mutateCredits("add");
  };

  const handleDeduct = async () => {
    await mutateCredits("deduct");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Current Credits:</span>
        <span>{credits}</span>
      </div>
      {balanceError && (
        <p className="text-sm text-destructive">{balanceError}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="min-w-[200px] flex-1"
        />
        <Button onClick={handleAdd} disabled={isActionDisabled}>
          Add
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeduct}
          disabled={isActionDisabled}
        >
          Deduct
        </Button>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium">Transactions</h3>
        {transactionsError ? (
          <p className="text-sm text-destructive">{transactionsError}</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {transactions.length === 0 && !isLoadingTransactions ? (
              <li className="text-muted-foreground">No transactions found.</li>
            ) : (
              transactions.map((tx, idx) => {
                const label = getTransactionLabel(tx) || "—";
                const amountDisplay = getTransactionAmount(tx) || "0";

                return (
                  <li key={idx} className="flex justify-between gap-4">
                    <span className="flex-1 truncate">{label}</span>
                    <span className="text-right tabular-nums">
                      {amountDisplay}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
