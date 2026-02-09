"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { registerStaff } from "@/services/staff";
import { StaffRoleEnum } from "@/types/user";
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
import { Separator } from "@/components/ui/separator";
import { UserPlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CountryCodePicker, getDialCode } from "@/components/ui/CountryCodePicker";
import { DateOfBirthInput, formatDateOfBirth, type DateOfBirth } from "@/components/ui/DateOfBirthInput";

const BASE_ROLE_OPTIONS = [
  { label: "Barber", value: "barber" },
  { label: "Coach", value: "coach" },
  { label: "Receptionist", value: "receptionist" },
  { label: "Admin", value: "admin" },
];

interface RegisterStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RegisterStaffModal({
  open,
  onOpenChange,
  onSuccess,
}: RegisterStaffModalProps) {
  const { user } = useUser();
  const { toast } = useToast();

  // Only super admins can create other super admins
  const ROLE_OPTIONS = user?.Role === StaffRoleEnum.SUPERADMIN
    ? [...BASE_ROLE_OPTIONS, { label: "Super Admin", value: "superadmin" }]
    : BASE_ROLE_OPTIONS;

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [dob, setDob] = useState<DateOfBirth>({ day: "01", month: "01", year: "2000" });
  const [role, setRole] = useState("");
  const [isActiveStaff, setIsActiveStaff] = useState(true);
  const [registering, setRegistering] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setRole("");
    setDob({ day: "01", month: "01", year: "2000" });
    setSelectedCountry("US");
    setGender("M");
    setIsActiveStaff(true);
  };

  const handleClose = () => {
    if (!registering) {
      onOpenChange(false);
      resetForm();
    }
  };

  const formatRoleName = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

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

    const dobString = formatDateOfBirth(dob);
    const dialCode = getDialCode(selectedCountry);

    // Format phone with dial code
    const formattedPhone = phoneNumber.trim()
      ? `${dialCode}${phoneNumber.trim().replace(/\D/g, "")}`
      : undefined;

    const staffData = {
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      email: trimmedEmail,
      password: trimmedPassword,
      dob: dobString,
      gender,
      country_code: selectedCountry,
      phone_number: formattedPhone,
      role: trimmedRole,
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

      resetForm();
      onOpenChange(false);
      onSuccess();
    }

    setRegistering(false);
  };

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    role.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Staff Member
          </DialogTitle>
          <DialogDescription>
            Create a new staff registration. The staff member will be added to the pending list
            and must be approved before they can log in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <CountryCodePicker
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="5141234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the phone number without the country code
              </p>
            </div>

            <DateOfBirthInput value={dob} onChange={setDob} />
          </div>

          <Separator />

          {/* Login Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Login Credentials
            </h3>
            <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>
          </div>

          <Separator />

          {/* Role & Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Role & Access
            </h3>
            <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={registering}>
            Cancel
          </Button>
          <Button onClick={handleRegisterStaff} disabled={registering || !isFormValid}>
            {registering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Register Staff
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
