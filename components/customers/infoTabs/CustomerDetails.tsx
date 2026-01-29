"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Customer } from "@/types/customer";
import { UserUpdateRequestDto } from "@/app/api/Api";
import { useToast } from "@/hooks/use-toast";
import { updateCustomer } from "@/services/customer";
import { initiateEmailChange, resendEmailChangeVerification, cancelEmailChange } from "@/services/user";
import { useUser } from "@/contexts/UserContext";
import { SaveIcon, User, Mail, Phone, AlertCircle, CreditCard, Smartphone, Check, X, Pencil, RefreshCw, Clock, Loader2, Trash2 } from "lucide-react";
import { StaffRoleEnum } from "@/types/user";

type FormField = "first_name" | "last_name" | "email" | "phone" | "emergency_contact_name" | "emergency_contact_phone" | "emergency_contact_relationship";

const NAME_INPUT_PATTERN = /^[a-zA-Z\s'-]*$/;
const EMAIL_INPUT_PATTERN = /^[a-zA-Z0-9@._+-]*$/;
const PHONE_INPUT_PATTERN = /^\+?[0-9\s-]*$/;

export default function DetailsTab({
  customer,
  onCustomerUpdated,
  onClose,
}: {
  customer: Customer;
  onCustomerUpdated?: (updated: Partial<Customer>) => void;
  onClose?: () => void;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  const [isLoading, setIsLoading] = useState(false);

  // Email change state
  const [emailChangeDialogOpen, setEmailChangeDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(customer.pending_email || null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isCancelingEmail, setIsCancelingEmail] = useState(false);

  const [formData, setFormData] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: (() => {
      const phone = customer.phone || "";
      if (!phone) return "+1";
      return phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
    })(),
    emergency_contact_name: customer.emergency_contact_name || "",
    emergency_contact_phone: customer.emergency_contact_phone || "",
    emergency_contact_relationship: customer.emergency_contact_relationship || "",
  });

  const handleChange = (field: FormField, value: string) => {
    const fieldPatterns: Record<FormField, RegExp | null> = {
      first_name: NAME_INPUT_PATTERN,
      last_name: NAME_INPUT_PATTERN,
      email: EMAIL_INPUT_PATTERN,
      phone: PHONE_INPUT_PATTERN,
      emergency_contact_name: NAME_INPUT_PATTERN,
      emergency_contact_phone: PHONE_INPUT_PATTERN,
      emergency_contact_relationship: null, // Allow any text for relationship
    };

    const pattern = fieldPatterns[field];

    if (pattern && !pattern.test(value)) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateCustomer = async () => {
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim()
    ) {
      toast({
        status: "error",
        description: "Name and email are required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "User JWT is missing",
        variant: "destructive",
      });
      return;
    }

    if (!customer.id) {
      toast({
        status: "error",
        description: "Customer ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const digits = formData.phone.replace(/\D/g, "");
      const formattedPhone = digits.startsWith("1")
        ? `+${digits}`
        : `+1${digits}`;

      const updateData: UserUpdateRequestDto & {
        emergency_contact_name?: string;
        emergency_contact_phone?: string;
        emergency_contact_relationship?: string;
      } = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formattedPhone,
        country_alpha2_code: "US",
        dob: "2000-01-01",
        has_marketing_email_consent: false,
        has_sms_consent: false,
        emergency_contact_name: formData.emergency_contact_name || undefined,
        emergency_contact_phone: formData.emergency_contact_phone || undefined,
        emergency_contact_relationship: formData.emergency_contact_relationship || undefined,
      };

      const error = await updateCustomer(customer.id, updateData, user.Jwt);

      if (error === null) {
        toast({
          status: "success",
          description: "Customer updated successfully",
        });
        if (onCustomerUpdated)
          onCustomerUpdated({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formattedPhone,
            emergency_contact_name: formData.emergency_contact_name || null,
            emergency_contact_phone: formData.emergency_contact_phone || null,
            emergency_contact_relationship: formData.emergency_contact_relationship || null,
          });
        onClose?.();
      } else {
        toast({
          status: "error",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        status: "error",
        description: "Failed to update customer information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateEmailChange = async () => {
    if (!newEmail.trim()) {
      toast({
        status: "error",
        description: "Please enter a new email address",
        variant: "destructive",
      });
      return;
    }

    if (!user?.Jwt || !customer.id) {
      toast({
        status: "error",
        description: "Missing authentication or customer information",
        variant: "destructive",
      });
      return;
    }

    setIsEmailChangeLoading(true);

    const { error, data } = await initiateEmailChange(customer.id, newEmail, user.Jwt);

    if (error) {
      toast({
        status: "error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        status: "success",
        description: `Verification email sent to ${newEmail}`,
      });
      setPendingEmail(newEmail);
      setEmailChangeDialogOpen(false);
      setNewEmail("");
    }

    setIsEmailChangeLoading(false);
  };

  const handleResendVerification = async () => {
    if (!user?.Jwt || !customer.id) return;

    setIsResendingEmail(true);

    const { error } = await resendEmailChangeVerification(customer.id, user.Jwt);

    if (error) {
      toast({
        status: "error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        status: "success",
        description: `Verification email resent to ${pendingEmail}`,
      });
    }

    setIsResendingEmail(false);
  };

  const handleCancelEmailChange = async () => {
    if (!user?.Jwt || !customer.id) return;

    setIsCancelingEmail(true);

    const { error } = await cancelEmailChange(customer.id, user.Jwt);

    if (error) {
      toast({
        status: "error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        status: "success",
        description: "Email change cancelled",
      });
      setPendingEmail(null);
    }

    setIsCancelingEmail(false);
  };

  return (
    <div className="space-y-6">
      {/* Customer Overview Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="flex flex-col gap-6 pt-6 md:flex-row md:items-start">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 border-2 border-yellow-500/20">
              <AvatarImage src={customer.profilePicture} alt={`${customer.first_name} ${customer.last_name}`} />
              <AvatarFallback className="bg-yellow-500/10 text-yellow-700 text-2xl">
                {customer.first_name?.charAt(0)}{customer.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {customer.first_name} {customer.last_name}
                </h2>
                {customer.memberships && customer.memberships.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {customer.memberships.map((membership, index) => (
                      <span key={membership.membership_plan_id || index} className="text-sm text-muted-foreground">
                        {membership.membership_name}
                        {index < customer.memberships.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No active membership
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {customer.memberships && customer.memberships.length > 0 ? (
                  <Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-700">
                    {customer.memberships.length === 1 ? "Member" : `${customer.memberships.length} Memberships`}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    No Membership
                  </Badge>
                )}
                {customer.memberships?.some(m => m.subscription_status === "past_due") && (
                  <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">
                    Payment Past Due
                  </Badge>
                )}
                {customer.is_archived ? (
                  <Badge variant="secondary" className="bg-rose-500/15 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-transparent">
                    Archived
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-transparent">
                    Active
                  </Badge>
                )}
                {customer.last_mobile_login_at ? (
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-transparent">
                    <Smartphone className="h-3 w-3 mr-1" />
                    <Check className="h-3 w-3 mr-1" />
                    {new Date(customer.last_mobile_login_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-rose-500/15 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-transparent">
                    <Smartphone className="h-3 w-3 mr-1" />
                    <X className="h-3 w-3 mr-1" />
                    No App
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone || "No phone provided"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deletion Countdown Alert */}
      {customer.days_until_deletion != null && (
        <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950/50">
          <Trash2 className="h-4 w-4" />
          <AlertTitle>Account Scheduled for Deletion</AlertTitle>
          <AlertDescription>
            This account will be permanently deleted in {customer.days_until_deletion} day{customer.days_until_deletion !== 1 ? "s" : ""}.
            {customer.archived_at && (
              <span className="block text-xs mt-1 text-muted-foreground">
                Archived on {new Date(customer.archived_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {customer.deleted_at && (
              <span className="block text-xs mt-1 text-muted-foreground">
                Deletion initiated on {new Date(customer.deleted_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className="bg-background"
                  disabled={isReceptionist}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className="bg-background"
                  disabled={isReceptionist}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Contact Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="cursor-not-allowed bg-muted flex-1"
                />
                {!isReceptionist && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEmailChangeDialogOpen(true)}
                    title="Change email"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {pendingEmail && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Pending email change to <span className="font-medium">{pendingEmail}</span>
                    </p>
                    <p className="text-xs text-amber-600/70 dark:text-amber-500/70">
                      Awaiting verification from the new email address
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={isResendingEmail}
                      className="h-8 px-2 text-amber-700 hover:text-amber-800 hover:bg-amber-500/20"
                    >
                      {isResendingEmail ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      <span className="ml-1">Resend</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEmailChange}
                      disabled={isCancelingEmail}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-500/20"
                    >
                      {isCancelingEmail ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span className="ml-1">Cancel</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+11234567890"
                className="bg-background"
                disabled={isReceptionist}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Section */}
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-lg">Emergency Contact</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                  placeholder="Emergency contact name"
                  className="bg-background"
                  disabled={isReceptionist}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Relationship</label>
                <Input
                  value={formData.emergency_contact_relationship}
                  onChange={(e) => handleChange("emergency_contact_relationship", e.target.value)}
                  placeholder="e.g., Parent, Spouse, Sibling"
                  className="bg-background"
                  disabled={isReceptionist}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleChange("emergency_contact_phone", e.target.value)}
                placeholder="+11234567890"
                className="bg-background"
                disabled={isReceptionist}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memberships Section */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Memberships</h3>
          </div>
          {customer.memberships && customer.memberships.length > 0 ? (
            <div className="space-y-3">
              {customer.memberships.map((membership, index) => (
                <div
                  key={membership.membership_plan_id || index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/50 border"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{membership.membership_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Plan: {membership.membership_plan_name || "N/A"}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:text-right space-y-1">
                    {membership.membership_start_date && (
                      <div className="text-sm text-muted-foreground">
                        Started: {new Date(membership.membership_start_date).toLocaleDateString()}
                      </div>
                    )}
                    {membership.membership_renewal_date && (
                      <div className="text-sm text-muted-foreground">
                        Renews: {new Date(membership.membership_renewal_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No active memberships</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {!isReceptionist && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            onClick={handleUpdateCustomer}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      )}

      {/* Email Change Dialog */}
      <Dialog open={emailChangeDialogOpen} onOpenChange={setEmailChangeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Enter the new email address for this customer. A verification email will be sent to the new address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEmailChangeDialogOpen(false);
                setNewEmail("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleInitiateEmailChange}
              disabled={isEmailChangeLoading || !newEmail.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              {isEmailChangeLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Verification"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
