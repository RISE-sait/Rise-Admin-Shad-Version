"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff, ExternalLink, X, User, Lock, AlertTriangle, FileCheck, Mail, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { registerAthlete } from "@/services/athlete";
import { revalidateCustomers } from "@/actions/serverActions";
import { cn } from "@/lib/utils";

interface AddAthleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WAIVER_TERMS_URL = "https://storage.googleapis.com/rise-sports/waivers/terms.pdf";
const WAIVER_LIABILITY_URL = "https://storage.googleapis.com/rise-sports/waivers/waiver.pdf";

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

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

const calculatePasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", color: "bg-red-500", textColor: "text-red-500", width: "33%" };
  if (score <= 3) return { label: "Medium", color: "bg-amber-500", textColor: "text-amber-500", width: "66%" };
  return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-500", width: "100%" };
};

export default function AddAthleteDialog({ open, onOpenChange }: AddAthleteDialogProps) {
  const { user } = useUser();
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
  const [phoneCountryCode, setPhoneCountryCode] = useState("CA");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("CA");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [termsSigned, setTermsSigned] = useState(false);
  const [waiverSigned, setWaiverSigned] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const pwStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirmPassword("");
    setFirstName(""); setLastName(""); setDateOfBirth("");
    setGender("M"); setPhoneCountryCode("CA"); setPhoneNumber(""); setCountryCode("CA");
    setEmergencyName(""); setEmergencyPhone(""); setEmergencyRelationship("");
    setEmailConsent(false); setSmsConsent(false); setTermsSigned(false); setWaiverSigned(false);
    setErrors({}); setShowPassword(false);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "At least 6 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords don't match";
    if (!firstName.trim()) errs.firstName = "Required";
    if (!lastName.trim()) errs.lastName = "Required";
    if (!dateOfBirth) errs.dob = "Required";
    if (!termsSigned) errs.terms = "Required";
    if (!waiverSigned) errs.waiver = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !user?.Jwt) return;
    setIsSubmitting(true);

    const dob = new Date(dateOfBirth);
    const dobString = `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(2, "0")}-${String(dob.getDate()).padStart(2, "0")}`;
    const dial = COUNTRIES.find((c) => c.code === phoneCountryCode)?.dial || "+1";
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    const result = await registerAthlete({
      email: email.trim(),
      password,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      dob: dobString,
      gender,
      country_code: countryCode,
      phone_number: cleanPhone ? `${dial}${cleanPhone}` : undefined,
      emergency_contact_name: emergencyName.trim() || undefined,
      emergency_contact_phone: emergencyPhone.replace(/\D/g, "") || undefined,
      emergency_contact_relationship: emergencyRelationship || undefined,
      has_consent_to_email_marketing: emailConsent,
      has_consent_to_sms: smsConsent,
      waivers: [
        { is_waiver_signed: termsSigned, waiver_url: WAIVER_TERMS_URL },
        { is_waiver_signed: waiverSigned, waiver_url: WAIVER_LIABILITY_URL },
      ],
    }, user.Jwt);

    if (result.error) {
      toast({ title: "Registration Failed", description: result.error, status: "error" });
    } else {
      toast({ title: "Athlete Registered", description: `${firstName} ${lastName} has been successfully registered.`, status: "success" });
      await revalidateCustomers();
      resetForm();
      onOpenChange(false);
    }
    setIsSubmitting(false);
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Progress calculation
  const completedSections = [
    email && password && confirmPassword && passwordsMatch,
    firstName && lastName && dateOfBirth,
    true, // Emergency is optional
    termsSigned && waiverSigned,
  ].filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="!max-w-[680px] !w-[680px] !h-auto p-0 gap-0 [&>div]:p-0 [&>div>div]:p-0 overflow-hidden">
        <DialogTitle className="sr-only">Register New Athlete</DialogTitle>
        {/* Header */}
        <div className="relative px-6 py-5 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="relative flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">New Athlete</h2>
              <p className="text-sm text-muted-foreground mt-1">Create a new athlete account</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors -mr-2 -mt-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Progress indicator */}
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  step <= completedSections ? "bg-primary" : "bg-primary/20"
                )}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Account Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                email && password && passwordsMatch
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              )}>
                {email && password && passwordsMatch ? <CheckCircle2 className="w-4 h-4" /> : "1"}
              </div>
              <div>
                <h3 className="font-medium">Account</h3>
                <p className="text-xs text-muted-foreground">Login credentials</p>
              </div>
            </div>

            <div className="ml-11 grid gap-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="athlete@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "mt-1.5 h-11 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all",
                      errors.email && "ring-2 ring-red-500 bg-red-50 dark:bg-red-500/10"
                    )}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "h-11 pr-10 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all",
                        errors.password && "ring-2 ring-red-500 bg-red-50 dark:bg-red-500/10"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all duration-300", pwStrength.color)}
                          style={{ width: pwStrength.width }}
                        />
                      </div>
                      <span className={cn("text-xs font-medium", pwStrength.textColor)}>{pwStrength.label}</span>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "mt-1.5 h-11 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all",
                      errors.confirmPassword && "ring-2 ring-red-500 bg-red-50 dark:bg-red-500/10",
                      passwordsMatch && "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                    )}
                  />
                  {passwordsMatch && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Match
                    </p>
                  )}
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Personal Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                firstName && lastName && dateOfBirth
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              )}>
                {firstName && lastName && dateOfBirth ? <CheckCircle2 className="w-4 h-4" /> : "2"}
              </div>
              <div>
                <h3 className="font-medium">Personal Details</h3>
                <p className="text-xs text-muted-foreground">Basic information</p>
              </div>
            </div>

            <div className="ml-11 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={cn(
                      "mt-1.5 h-11 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all",
                      errors.firstName && "ring-2 ring-red-500 bg-red-50 dark:bg-red-500/10"
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={cn(
                      "mt-1.5 h-11 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all",
                      errors.lastName && "ring-2 ring-red-500 bg-red-50 dark:bg-red-500/10"
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={cn(
                      "mt-1.5 h-11 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all",
                      errors.dob && "ring-2 ring-red-500 bg-red-50 dark:bg-red-500/10"
                    )}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Gender</Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as "M" | "F")}>
                    <SelectTrigger className="mt-1.5 h-11 bg-muted/50 border-0 focus:bg-background focus:ring-2 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <Select value={countryCode} onValueChange={(c) => { setCountryCode(c); setPhoneCountryCode(c); }}>
                    <SelectTrigger className="mt-1.5 h-11 bg-muted/50 border-0 focus:bg-background focus:ring-2 transition-all">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <span className="text-base">{getFlagEmoji(countryCode)}</span>
                          <span className="truncate">{COUNTRIES.find(c => c.code === countryCode)?.name}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          <span className="flex items-center gap-2">
                            <span>{getFlagEmoji(c.code)}</span>
                            <span>{c.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Phone <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
                    <SelectTrigger className="h-11 w-[90px] bg-muted/50 border-0 focus:bg-background focus:ring-2 transition-all">
                      <SelectValue>
                        <span className="flex items-center gap-1">
                          <span>{getFlagEmoji(phoneCountryCode)}</span>
                          <span className="text-xs text-muted-foreground">{COUNTRIES.find(c => c.code === phoneCountryCode)?.dial}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {getFlagEmoji(c.code)} {c.dial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="514 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className="h-11 flex-1 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Emergency Contact Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                emergencyName && emergencyPhone
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              )}>
                {emergencyName && emergencyPhone ? <CheckCircle2 className="w-4 h-4" /> : "3"}
              </div>
              <div>
                <h3 className="font-medium">Emergency Contact</h3>
                <p className="text-xs text-muted-foreground">Optional but recommended</p>
              </div>
            </div>

            <div className="ml-11 grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  placeholder="Jane Doe"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="mt-1.5 h-11 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <Input
                  type="tel"
                  placeholder="514 123 4567"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value.replace(/\D/g, ""))}
                  className="mt-1.5 h-11 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-2 transition-all"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Relationship</Label>
                <Select value={emergencyRelationship} onValueChange={setEmergencyRelationship}>
                  <SelectTrigger className="mt-1.5 h-11 bg-muted/50 border-0 focus:bg-background focus:ring-2 transition-all">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Agreements Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                termsSigned && waiverSigned
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              )}>
                {termsSigned && waiverSigned ? <CheckCircle2 className="w-4 h-4" /> : "4"}
              </div>
              <div>
                <h3 className="font-medium">Agreements</h3>
                <p className="text-xs text-muted-foreground">Required documents</p>
              </div>
            </div>

            <div className="ml-11 space-y-2">
              <button
                type="button"
                onClick={() => setTermsSigned(!termsSigned)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                  termsSigned
                    ? "bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-200 dark:ring-emerald-500/30"
                    : "bg-muted/50 hover:bg-muted",
                  errors.terms && !termsSigned && "ring-1 ring-red-300 bg-red-50 dark:bg-red-500/10"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full transition-colors",
                  termsSigned ? "bg-emerald-500 text-white" : "border-2 border-muted-foreground/30"
                )}>
                  {termsSigned && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Terms & Conditions</p>
                  <p className="text-xs text-muted-foreground">I agree to the terms of service</p>
                </div>
                <a
                  href={WAIVER_TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </button>

              <button
                type="button"
                onClick={() => setWaiverSigned(!waiverSigned)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                  waiverSigned
                    ? "bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-200 dark:ring-emerald-500/30"
                    : "bg-muted/50 hover:bg-muted",
                  errors.waiver && !waiverSigned && "ring-1 ring-red-300 bg-red-50 dark:bg-red-500/10"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full transition-colors",
                  waiverSigned ? "bg-emerald-500 text-white" : "border-2 border-muted-foreground/30"
                )}>
                  {waiverSigned && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Liability Waiver</p>
                  <p className="text-xs text-muted-foreground">I accept the liability waiver</p>
                </div>
                <a
                  href={WAIVER_LIABILITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </button>
            </div>
          </div>

          {/* Marketing Preferences */}
          <div className="ml-11 pt-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Communication</p>
            <div className="flex flex-wrap gap-3">
              <label className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all",
                emailConsent ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/50 hover:bg-muted"
              )}>
                <Checkbox
                  checked={emailConsent}
                  onCheckedChange={(c) => setEmailConsent(c === true)}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-sm">Email updates</span>
              </label>
              <label className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all",
                smsConsent ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/50 hover:bg-muted"
              )}>
                <Checkbox
                  checked={smsConsent}
                  onCheckedChange={(c) => setSmsConsent(c === true)}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-sm">SMS notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <div>
            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Please complete required fields
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[140px] h-10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Athlete"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
