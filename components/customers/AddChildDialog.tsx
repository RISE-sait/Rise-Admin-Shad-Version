"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerAthlete } from "@/services/athlete";
import { linkChildToParent } from "@/services/customer";

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string;
  jwt: string;
  onChildAdded: () => void;
}

const COUNTRIES = [
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "IN", name: "India", dial: "+91" },
];

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const calculatePasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 2)
    return {
      label: "Weak",
      color: "bg-red-500",
      textColor: "text-red-500",
      width: "33%",
    };
  if (score <= 3)
    return {
      label: "Medium",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      width: "66%",
    };
  return {
    label: "Strong",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    width: "100%",
  };
};

export default function AddChildDialog({
  open,
  onOpenChange,
  parentId,
  jwt,
  onChildAdded,
}: AddChildDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [countryCode, setCountryCode] = useState("CA");

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setGender("M");
    setCountryCode("CA");
    setShowPassword(false);
  };

  const isFormValid =
    email.trim() &&
    password.length >= 6 &&
    password === confirmPassword &&
    firstName.trim() &&
    lastName.trim() &&
    dateOfBirth;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // Step 1: Register the athlete account via Firebase + backend
      const result = await registerAthlete(
        {
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          dob: dateOfBirth,
          gender,
          country_code: countryCode,
        },
        jwt
      );

      if (result.error) {
        toast({
          status: "error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Step 2: Search for the newly created customer to get their ID
      // We need to wait a moment for the backend to process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Import getCustomers dynamically to find the new customer
      const { getCustomers } = await import("@/services/customer");
      const searchResult = await getCustomers(email.trim(), 1, 5, jwt);
      const newChild = searchResult.customers.find(
        (c) => c.email === email.trim()
      );

      if (newChild) {
        // Step 3: Link the new child to the parent
        const linkError = await linkChildToParent(newChild.id, parentId, jwt);
        if (linkError) {
          toast({
            status: "error",
            description: `Account created but linking failed: ${linkError}`,
            variant: "destructive",
          });
        } else {
          toast({
            status: "success",
            description: `${firstName} ${lastName} created and linked as child`,
          });
        }
      } else {
        toast({
          status: "error",
          description:
            "Account created but could not find it to link. You can manually link it from the Family tab.",
          variant: "destructive",
        });
      }

      onChildAdded();
      resetForm();
      onOpenChange(false);
    } catch {
      toast({
        status: "error",
        description: "Failed to create child account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Child Account</DialogTitle>
          <DialogDescription>
            Create a new account and automatically link it as a child.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Account Credentials */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Account Credentials
            </h4>
            <div>
              <Label htmlFor="child-email">Email</Label>
              <Input
                id="child-email"
                type="email"
                placeholder="child@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="child-password">Password</Label>
              <div className="relative">
                <Input
                  id="child-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-1.5">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${passwordStrength.textColor}`}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="child-confirm-password">Confirm Password</Label>
              <Input
                id="child-confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive mt-0.5">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Personal Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="child-first-name">First Name</Label>
                <Input
                  id="child-first-name"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="child-last-name">Last Name</Label>
                <Input
                  id="child-last-name"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="child-dob">Date of Birth</Label>
              <Input
                id="child-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Gender</Label>
                <Select
                  value={gender}
                  onValueChange={(v) => setGender(v as "M" | "F")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Country</Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {getFlagEmoji(c.code)} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create & Link Child Account"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
