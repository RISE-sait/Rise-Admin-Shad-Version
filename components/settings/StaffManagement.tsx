"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { getAllStaffs } from "@/services/staff";
import { User, StaffRoleEnum } from "@/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StaffForm from "@/components/staff/StaffForm";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RegisterStaffModal } from "./staff/RegisterStaffModal";
import { StaffTable } from "./staff/StaffTable";

const ROLE_OPTIONS = [
  { label: "Barber", value: "barber" },
  { label: "Coach", value: "coach" },
  { label: "Receptionist", value: "receptionist" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "superadmin" },
];

const ITEMS_PER_PAGE = 10;

export default function StaffManagement() {
  const { user } = useUser();
  const { toast } = useToast();

  // Modal state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Staff list state
  const [allStaff, setAllStaff] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Staff info panel state
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [staffInfoOpen, setStaffInfoOpen] = useState(false);

  // Load staff list
  const loadStaffList = useCallback(async () => {
    setLoading(true);
    try {
      const staffs = await getAllStaffs();
      setAllStaff(staffs);
    } catch (error) {
      console.error("Error loading staff:", error);
      toast({
        title: "Error loading staff",
        description: error instanceof Error ? error.message : "Failed to load staff",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStaffList();
  }, [loadStaffList]);

  // Filter staff by role
  const filteredStaff = roleFilter === "all"
    ? allStaff
    : allStaff.filter(staff => staff.StaffInfo?.Role?.toLowerCase() === roleFilter);

  const totalStaff = filteredStaff.length;
  const totalPages = Math.ceil(totalStaff / ITEMS_PER_PAGE);

  // Get current page's staff
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const staffList = filteredStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when role filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  const handleStaffClick = (staff: User) => {
    setSelectedStaff(staff);
    setStaffInfoOpen(true);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Super Admin Only:</strong> This section allows you to create
          staff accounts and manage team members. Use this to register barbers,
          coaches, receptionists, admins, or other super admins.
        </AlertDescription>
      </Alert>

      {/* Staff List */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Staff Members</CardTitle>
            </div>
            <Button onClick={() => setRegisterModalOpen(true)} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Staff
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardDescription>
              View and manage all registered staff members ({totalStaff} total)
            </CardDescription>
            <div className="flex items-center gap-2">
              <Label htmlFor="roleFilter" className="text-sm whitespace-nowrap">
                Filter:
              </Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="roleFilter" className="w-[150px]">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StaffTable
            staffList={staffList}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalStaff={totalStaff}
            itemsPerPage={ITEMS_PER_PAGE}
            roleFilter={roleFilter}
            onPageChange={setCurrentPage}
            onStaffClick={handleStaffClick}
          />
        </CardContent>
      </Card>

      {/* Register Staff Modal */}
      <RegisterStaffModal
        open={registerModalOpen}
        onOpenChange={setRegisterModalOpen}
        onSuccess={loadStaffList}
      />

      {/* Staff Info Panel */}
      <Sheet open={staffInfoOpen} onOpenChange={(open) => {
        setStaffInfoOpen(open);
        if (!open) {
          loadStaffList();
        }
      }}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {selectedStaff && (
            <StaffForm
              StaffData={selectedStaff}
              onClose={async () => {
                setStaffInfoOpen(false);
                await loadStaffList();
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
