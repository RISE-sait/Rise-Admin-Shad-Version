"use client";

// React and utility imports
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, Search } from "lucide-react";
import RightDrawer from "../reusable/RightDrawer";
import { Customer } from "@/types/customer";
import { Input } from "@/components/ui/input";
import CustomerTable from "./CustomerTable";
import CustomerInfoPanel from "./CustomerInfoPanel";
import AddCustomerForm from "./AddCustomerForm";
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
import { archiveCustomer, unarchiveCustomer } from "@/services/customer";
import { useUser } from "@/contexts/UserContext";

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
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  // State for search input and column visibility toggles
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  useEffect(() => {
    setSearchQuery(searchTerm);
  }, [searchTerm]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Custom hook to sync URL query parameters for search & pagination
  const { replace, val } = useRouterQuery<{
    search: string;
    page: string;
  }>({
    search: searchTerm,
    page: String(currentPage), // <- 👈 Keep page synced
  });

  // Handler to open drawer with customer details
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerContent("details");
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
          {/* Search icon inside input */}
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(event) => {
              const { value } = event.target;
              if (!SEARCH_INPUT_PATTERN.test(value)) {
                return;
              }

              setSearchQuery(value);
              // Debounce URL update for smoother UX
              debounce(() => replace({ search: value }), 30)();
            }}
          />
        </div>
        <div className="flex items-center gap-4">
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
                onClick={() => replace({ search: searchTerm, page: "1" })}
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
                  replace({ search: searchTerm, page: String(page) })
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
                  replace({ search: searchTerm, page: String(totalPages) })
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
              replace({ search: searchTerm, page: String(currentPage - 1) })
            }
          >
            Prev
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              replace({ search: searchTerm, page: String(currentPage + 1) })
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

      {/* Drawer for customer details or add form */}
      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        drawerWidth={drawerContent === "details" ? "w-[75%]" : "w-[25%]"}
      >
        <div className="p-4">
          {/* Drawer header based on mode */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {drawerContent === "details" ? "Customer Details" : "Add Customer"}
          </h2>
          {/* Conditional content: details view or add form */}
          {drawerContent === "details" && selectedCustomer && (
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
          {drawerContent === "add" && (
            <AddCustomerForm
              onCustomerAdded={() => {}}
              onCancel={() => setDrawerOpen(false)}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}
