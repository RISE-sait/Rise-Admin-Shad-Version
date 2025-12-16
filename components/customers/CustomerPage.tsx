"use client";

// React and utility imports
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, Search, Download, Loader2 } from "lucide-react";
import RightDrawer from "../reusable/RightDrawer";
import { Customer } from "@/types/customer";
import { Input } from "@/components/ui/input";
import CustomerTable from "./CustomerTable";
import CustomerInfoPanel from "./CustomerInfoPanel";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { columns } from "./CustomerTable";
import { VisibilityState } from "@tanstack/react-table";
import { AlertModal } from "@/components/ui/AlertModal";
import { useRouterQuery } from "@/hooks/router-query";
import {
  archiveCustomer,
  unarchiveCustomer,
  exportCustomers,
  exportArchivedCustomers,
} from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { StaffRoleEnum } from "@/types/user";

// Define props for the CustomersPage component
interface CustomerPageProps {
  searchTerm: string;
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  title?: string;
  isArchivedList?: boolean;
  onArchiveCustomer?: (id: string) => Promise<void>;
  onUnarchiveCustomer?: (id: string) => Promise<void>;
}

// Utility debounce function to limit how often a function can fire
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Main component for displaying and managing customers
const SEARCH_INPUT_PATTERN = /^[a-zA-Z0-9\s'-]*$/;

export default function CustomersPage({
  customers,
  searchTerm,
  currentPage,
  totalPages,
  totalCount,
  title,
  isArchivedList,
  onArchiveCustomer,
  onUnarchiveCustomer,
}: CustomerPageProps) {
  // State hooks for selected customer details drawer
  const [customerList, setCustomerList] = useState<Customer[]>(customers);

  useEffect(() => {
    setCustomerList(customers);
  }, [customers]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  // State for search input and column visibility toggles
  // Use uncontrolled-like pattern: local state is source of truth for the input
  // The URL/prop is only used for initial value, not for syncing back
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const isFirstRender = useRef(true);
  useEffect(() => {
    // Only sync on first render (handles browser back/forward navigation)
    // After that, local state is the source of truth to prevent race conditions
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Don't sync from prop after initial render - this causes the character dropping bug
  }, [searchTerm]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Clear loading state when search results arrive
  useEffect(() => {
    setIsSearching(false);
  }, [customers]);

  // Use different search param names for active vs archived to prevent interference
  const searchParamName = isArchivedList ? "archivedSearch" : "search";
  const pageParamName = isArchivedList ? "archivedPage" : "page";

  // Custom hook to sync URL query parameters for search & pagination
  const { replace, val } = useRouterQuery<{
    [key: string]: string;
  }>({
    [searchParamName]: searchTerm,
    [pageParamName]: String(currentPage),
  });

  // Create a stable debounced search handler
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Update local state immediately (this is the source of truth for the input)
      setSearchQuery(value);

      // Debounce the URL update to trigger server-side search
      debounceTimerRef.current = setTimeout(() => {
        setIsSearching(true);
        replace({ [searchParamName]: value });
      }, 300);
    },
    [replace, searchParamName]
  );

  // Handler to open drawer with customer details
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  // Handler to update column visibility state
  const handleColumnVisibilityChange = (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => {
    setColumnVisibility((prev) => {
      const newState = typeof updater === "function" ? updater(prev) : updater;
      return { ...prev, ...newState };
    });
  };

  // Placeholder for bulk delete action
  const handleBulkDelete = async () => {
    try {
      // Reset selection and close modal
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      // Ideally, show a success toast here
    } catch (error) {
      console.error("Error deleting customers:", error);
      // Ideally, show an error toast here
    }
  };

  const handleCustomerUpdate = (id: string, updated: Partial<Customer>) => {
    setCustomerList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    setSelectedCustomer((prev) =>
      prev && prev.id === id ? { ...prev, ...updated } : prev
    );
  };

  // Get current user context for auth-protected actions
  const { user } = useUser();
  const { toast } = useToast();

  // Archive a customer: calls service and reloads page on success
  const handleArchive = async (id: string) => {
    if (!user) return;
    await archiveCustomer(id, user.Jwt);
    setCustomerList((prev) => prev.filter((c) => c.id !== id));
    if (selectedCustomer?.id === id) {
      setDrawerOpen(false);
      setSelectedCustomer(null);
    }
  };

  // Unarchive a customer: calls service and reloads page on success
  const handleUnarchive = async (id: string) => {
    if (!user) return;
    await unarchiveCustomer(id, user.Jwt);
    setCustomerList((prev) => prev.filter((c) => c.id !== id));
    if (selectedCustomer?.id === id) {
      setDrawerOpen(false);
      setSelectedCustomer(null);
    }
  };

  // Export customers list
  const handleExport = async () => {
    if (!user) {
      toast({
        status: "error",
        description: "You must be logged in to export customers",
      });
      return;
    }

    setIsExporting(true);
    try {
      console.log("🔄 Starting customer export...");
      const blob = isArchivedList
        ? await exportArchivedCustomers(user.Jwt)
        : await exportCustomers(user.Jwt);
      console.log("✅ Export successful, blob size:", blob.size);

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = isArchivedList
        ? `archived-customers-export-${new Date().toISOString().split("T")[0]}.csv`
        : `customers-export-${new Date().toISOString().split("T")[0]}.csv`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        status: "success",
        description: "Customers exported successfully",
      });
    } catch (error) {
      console.error("❌ Error exporting customers:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        status: "error",
        description:
          error instanceof Error ? error.message : "Failed to export customers",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      {/* Header section with title & description */}
      <div className="flex items-center justify-between">
        <Heading
          title={title || "Customers"}
          description="Manage your customers and their details"
        />
      </div>
      <Separator />

      {/* Search and filter controls */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          {/* Search icon or loading spinner inside input */}
          {isSearching ? (
            <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-yellow-500 animate-spin" />
          ) : (
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(event) => {
              handleSearchChange(event.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          {/* Export button */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          {/* Column visibility dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns
                .filter((column) => (column as any).enableHiding !== false)
                .map((column) => {
                  const columnId = (column as any).id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className="capitalize"
                      checked={columnVisibility[columnId] ?? true}
                      onCheckedChange={(value) =>
                        handleColumnVisibilityChange((prev) => ({
                          ...prev,
                          [columnId]: value,
                        }))
                      }
                    >
                      {columnId}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Bulk delete button appears when selections exist */}
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setBulkDeleteOpen(true)}
              className="ml-4"
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Customer table with pagination controls below */}
      <CustomerTable
        customers={customerList}
        onCustomerSelect={handleCustomerSelect}
        onArchiveCustomer={
          isArchivedList
            ? onUnarchiveCustomer || handleUnarchive
            : onArchiveCustomer || handleArchive
        }
        isArchivedList={isArchivedList}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {totalPages} — {totalCount} total
        </span>
        <div className="flex gap-1 items-center">
          {/* Pagination: first page shortcut */}
          {currentPage > 3 && (
            <>
              <Button
                variant="ghost"
                onClick={() =>
                  replace({
                    [searchParamName]: searchTerm,
                    [pageParamName]: "1",
                  })
                }
              >
                1
              </Button>
              {currentPage > 4 && (
                <span className="text-muted-foreground px-1">...</span>
              )}
            </>
          )}

          {/* Display current, previous, and next page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1
            )
            .map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() =>
                  replace({
                    [searchParamName]: searchTerm,
                    [pageParamName]: String(page),
                  })
                }
              >
                {page}
              </Button>
            ))}

          {/* Shortcut to last page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="text-muted-foreground px-1">...</span>
              )}
              <Button
                variant="ghost"
                onClick={() =>
                  replace({
                    [searchParamName]: searchTerm,
                    [pageParamName]: String(totalPages),
                  })
                }
              >
                {totalPages}
              </Button>
            </>
          )}

          {/* Prev/Next controls */}
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() =>
              replace({
                [searchParamName]: searchTerm,
                [pageParamName]: String(currentPage - 1),
              })
            }
          >
            Prev
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              replace({
                [searchParamName]: searchTerm,
                [pageParamName]: String(currentPage + 1),
              })
            }
          >
            Next
          </Button>
        </div>
      </div>

      {/* Confirmation modal for bulk delete */}
      <AlertModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={false} // Update with actual loading state if needed
      />

      {/* Drawer for customer details */}
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth="w-[75%]"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Customer Details
          </h2>
          {selectedCustomer && (
            <CustomerInfoPanel
              customer={selectedCustomer}
              onCustomerUpdated={(updated) =>
                handleCustomerUpdate(selectedCustomer.id, updated)
              }
              onCustomerArchived={
                isArchivedList
                  ? onUnarchiveCustomer || handleUnarchive
                  : onArchiveCustomer || handleArchive
              }
              onClose={() => setDrawerOpen(false)}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}
