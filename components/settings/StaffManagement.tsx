"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { registerStaff, getAllStaffs } from "@/services/staff";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StaffForm from "@/components/staff/StaffForm";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

const BASE_ROLE_OPTIONS = [
  { label: "Barber", value: "barber" },
  { label: "Coach", value: "coach" },
  { label: "Receptionist", value: "receptionist" },
  { label: "Admin", value: "admin" },
];

const ITEMS_PER_PAGE = 10;

export default function StaffManagement() {
  const { user } = useUser();
  const { toast } = useToast();

  // Only super admins can create other super admins
  const ROLE_OPTIONS = user?.Role === StaffRoleEnum.SUPERADMIN
    ? [...BASE_ROLE_OPTIONS, { label: "Super Admin", value: "superadmin" }]
    : BASE_ROLE_OPTIONS;

  // Registration form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [dob, setDob] = useState({ day: "01", month: "01", year: "2000" });
  const [role, setRole] = useState("");
  const [isActiveStaff, setIsActiveStaff] = useState(true);
  const [registering, setRegistering] = useState(false);

  // Staff list state
  const [allStaff, setAllStaff] = useState<User[]>([]); // All staff from API
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Staff info panel state
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [staffInfoOpen, setStaffInfoOpen] = useState(false);

  // Load staff list with useCallback to prevent recreation
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

  // Filter staff by role and paginate client-side
  const filteredStaff = roleFilter === "all"
    ? allStaff
    : allStaff.filter(staff => staff.StaffInfo?.Role?.toLowerCase() === roleFilter);

  const totalStaff = filteredStaff.length;
  const totalPages = Math.ceil(totalStaff / ITEMS_PER_PAGE);

  // Get current page's staff
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const staffList = filteredStaff.slice(startIndex, endIndex);

  // Reset to page 1 when role filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  const handleRegisterStaff = async () => {
    if (!user?.Jwt) {
      toast({
        title: "Authentication required",
        description: "Please log in to register staff",
        status: "error",
      });
      return;
    }

    // Trim and validate required fields
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedRole = role.trim();

    // Validate required fields
    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword || !trimmedRole) {
      const missingFields = [];
      if (!trimmedFirstName) missingFields.push("First Name");
      if (!trimmedLastName) missingFields.push("Last Name");
      if (!trimmedEmail) missingFields.push("Email");
      if (!trimmedPassword) missingFields.push("Password");
      if (!trimmedRole) missingFields.push("Role");

      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        status: "error",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        status: "error",
      });
      return;
    }

    // Validate password length
    if (trimmedPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        status: "error",
      });
      return;
    }

    // Validate password confirmation
    if (trimmedPassword !== trimmedConfirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same",
        status: "error",
      });
      return;
    }

    setRegistering(true);

    const dobString = `${dob.year}-${dob.month.padStart(2, "0")}-${dob.day.padStart(2, "0")}`;
    const formattedPhone = phoneNumber.trim()
      ? phoneNumber.trim().startsWith("+")
        ? phoneNumber.trim()
        : `+${phoneNumber.trim()}`
      : undefined;

    const staffData = {
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      email: trimmedEmail,
      password: trimmedPassword,
      dob: dobString,
      gender,
      country_code: countryCode.trim().toUpperCase(),
      phone_number: formattedPhone,
      role: trimmedRole, // Already in correct lowercase format from ROLE_OPTIONS
      is_active_staff: isActiveStaff,
    };

    const result = await registerStaff(staffData, user.Jwt);

    if (result.error) {
      console.error("Staff registration error:", result.error);
      toast({
        title: "Registration failed",
        description: result.error,
        status: "error",
      });
    } else {
      toast({
        title: "Staff registered successfully",
        description: `${trimmedFirstName} ${trimmedLastName} has been registered as ${formatRoleName(trimmedRole)}. Please go to the Staff tab to approve them.`,
        status: "success",
      });

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhoneNumber("");
      setRole("");
      setDob({ day: "01", month: "01", year: "2000" });
      setCountryCode("US");
      setGender("M");
      setIsActiveStaff(true);

      // Reload staff list
      loadStaffList();
    }

    setRegistering(false);
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case StaffRoleEnum.SUPERADMIN:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case StaffRoleEnum.IT:
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case StaffRoleEnum.ADMIN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case StaffRoleEnum.COACH:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case StaffRoleEnum.BARBER:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case StaffRoleEnum.RECEPTIONIST:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatRoleName = (role?: string) => {
    if (!role) return "Unknown";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

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

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle>Register New Staff Member</CardTitle>
          </div>
          <CardDescription>
            Create a new staff registration. The staff member will be added to the pending list
            and must be approved before they can log in. Their Firebase account will be created
            upon approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used for login and notifications
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as "M" | "F")}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+15141234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +1 for US/Canada)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country Code</Label>
                <Input
                  id="country"
                  placeholder="US"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                  maxLength={2}
                />
                <p className="text-xs text-muted-foreground">
                  Two-letter country code (e.g., US, CA, GB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="DD"
                    className="w-20"
                    maxLength={2}
                    value={dob.day}
                    onChange={(e) => setDob(prev => ({ ...prev, day: e.target.value }))}
                  />
                  <Input
                    placeholder="MM"
                    className="w-20"
                    maxLength={2}
                    value={dob.month}
                    onChange={(e) => setDob(prev => ({ ...prev, month: e.target.value }))}
                  />
                  <Input
                    placeholder="YYYY"
                    className="w-28"
                    maxLength={4}
                    value={dob.year}
                    onChange={(e) => setDob(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Login Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Login Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Must match the password above
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Role & Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Role & Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">
                  Staff Role <span className="text-red-500">*</span>
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Determines what the staff member can access in the system
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Account Status</Label>
                <Select
                  value={isActiveStaff ? "active" : "inactive"}
                  onValueChange={(v) => setIsActiveStaff(v === "active")}
                >
                  <SelectTrigger id="active">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Active accounts can log in immediately
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleRegisterStaff}
              disabled={
                registering ||
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim() ||
                !role.trim()
              }
              className="min-w-[200px]"
            >
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register Staff Member
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Staff Members</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="roleFilter" className="text-sm whitespace-nowrap">
                Filter by role:
              </Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="roleFilter" className="w-[180px]">
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
          <CardDescription>
            View and manage all registered staff members ({totalStaff} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : staffList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {roleFilter && roleFilter !== "all"
                  ? `No ${roleFilter} staff members found`
                  : "No staff members found"}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((staff) => (
                      <TableRow
                        key={staff.ID}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleStaffClick(staff)}
                      >
                        <TableCell className="font-medium">{staff.Name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {staff.Email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {staff.Phone || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getRoleBadgeColor(staff.StaffInfo?.Role)}
                          >
                            {formatRoleName(staff.StaffInfo?.Role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {staff.StaffInfo?.IsActive ? (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-500">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">Inactive</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalStaff)} of{" "}
                    {totalStaff} staff members
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Staff Info Panel */}
      <Sheet open={staffInfoOpen} onOpenChange={(open) => {
        setStaffInfoOpen(open);
        if (!open) {
          // Reload the list when closing the panel
          loadStaffList();
        }
      }}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {selectedStaff && (
            <StaffForm
              StaffData={selectedStaff}
              onClose={async () => {
                setStaffInfoOpen(false);
                // Reload list after any changes (delete, update, etc.)
                await loadStaffList();
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
