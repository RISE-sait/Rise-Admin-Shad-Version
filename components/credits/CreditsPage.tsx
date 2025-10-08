"use client";

import React, { useCallback, useMemo, useState } from "react";
import { CreditPackage } from "@/types/credit-package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RightDrawer from "@/components/reusable/RightDrawer";
import { ChevronDown, PlusIcon, Search } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisibilityState } from "@tanstack/react-table";
import CreditPackageTable from "./table/CreditPackageTable";
import columns from "./table/columns";
import CreditPackageInfoPanel from "./CreditPackageInfoPanel";
import AddCreditPackageForm from "./AddCreditPackageForm";
import { getAllCreditPackages } from "@/services/creditPackages";

interface CreditsPageProps {
  initialCreditPackages: CreditPackage[];
}

type DrawerContent = "details" | "add" | null;

export default function CreditsPage({
  initialCreditPackages,
}: CreditsPageProps) {
  const [creditPackages, setCreditPackages] = useState(initialCreditPackages);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null);
  const [selectedCreditPackageId, setSelectedCreditPackageId] = useState<
    string | null
  >(null);
  const [selectedCreditPackage, setSelectedCreditPackage] =
    useState<CreditPackage | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredCreditPackages = useMemo(() => {
    if (!searchQuery) {
      return creditPackages;
    }
    const lowerQuery = searchQuery.toLowerCase();
    return creditPackages.filter((creditPackage) => {
      return (
        creditPackage.name.toLowerCase().includes(lowerQuery) ||
        creditPackage.description?.toLowerCase().includes(lowerQuery) ||
        creditPackage.stripe_price_id.toLowerCase().includes(lowerQuery)
      );
    });
  }, [creditPackages, searchQuery]);

  const handleCreditPackageSelect = useCallback(
    (creditPackage: CreditPackage) => {
      setSelectedCreditPackageId(creditPackage.id);
      setSelectedCreditPackage(creditPackage);
      setDrawerContent("details");
      setDrawerOpen(true);
    },
    []
  );

  const refreshCreditPackages = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const latestCreditPackages = await getAllCreditPackages();
      setCreditPackages(latestCreditPackages);

      if (selectedCreditPackageId) {
        const refreshedSelection = latestCreditPackages.find(
          (creditPackage) => creditPackage.id === selectedCreditPackageId
        );
        setSelectedCreditPackage(refreshedSelection ?? null);
        if (!refreshedSelection) {
          setDrawerOpen(false);
          setDrawerContent(null);
          setSelectedCreditPackageId(null);
        }
      }
    } catch (error) {
      console.error("Error refreshing credit packages:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedCreditPackageId]);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setDrawerContent(null);
    setSelectedCreditPackageId(null);
    setSelectedCreditPackage(null);
  }, []);

  const handleAfterMutation = useCallback(async () => {
    await refreshCreditPackages();
  }, [refreshCreditPackages]);

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Credit Packages"
          description="Manage credit packages and their availability"
        />
        <Button
          onClick={() => {
            setDrawerContent("add");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Credit Package
        </Button>
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search credit packages..."
            className="pl-8"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Columns
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((column) => column.enableHiding !== false)
                .map((column) => {
                  const columnId = (column as any).id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className="capitalize"
                      checked={columnVisibility[columnId] ?? true}
                      onCheckedChange={(value) =>
                        setColumnVisibility((previous) => ({
                          ...previous,
                          [columnId]: value,
                        }))
                      }
                    >
                      {columnId.replace(/_/g, " ")}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CreditPackageTable
        creditPackages={filteredCreditPackages}
        onCreditPackageSelect={handleCreditPackageSelect}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        isRefreshing={isRefreshing}
      />

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[30%]"}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details"
              ? "Credit Package Details"
              : "Add Credit Package"}
          </h2>
          {drawerContent === "details" && selectedCreditPackage && (
            <CreditPackageInfoPanel
              creditPackage={selectedCreditPackage}
              onClose={handleDrawerClose}
              onSuccess={handleAfterMutation}
            />
          )}
          {drawerContent === "add" && (
            <AddCreditPackageForm
              onSuccess={async () => {
                await handleAfterMutation();
                setDrawerOpen(false);
                setDrawerContent(null);
              }}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}
