"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Trash, Save, Mail, Phone, User as UserIcon } from "lucide-react";
import StaffProfilePictureUpload from "./StaffProfilePictureUpload";
import { useUser } from "@/contexts/UserContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { revalidateStaffs } from "@/actions/serverActions";
import { deleteStaff, updateStaff } from "@/services/staff";
import { updateUser } from "@/services/user";
import { StaffRoleEnum, User } from "@/types/user";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = Object.entries(StaffRoleEnum).map(([key, value]) => ({
  label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  value,
}));

export default function StaffForm({
  StaffData,
  onClose,
}: {
  StaffData?: User;
  onClose?: () => void;
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [role, setRole] = useState(StaffData?.StaffInfo?.Role || "");
  const [isActive, setIsActive] = useState(
    StaffData?.StaffInfo?.IsActive || false
  );
  const [firstName, setFirstName] = useState(
    StaffData?.Name.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    StaffData?.Name.split(" ").slice(1).join(" ") || ""
  );
  const [email, setEmail] = useState(StaffData?.Email || "");
  const [phone, setPhone] = useState(StaffData?.Phone || "");
  const [profilePicture, setProfilePicture] = useState(
    StaffData?.PhotoUrl || ""
  );

  const { user } = useUser();
  const jwt = user?.Jwt;
  const { toast } = useToast();

  const sanitizeNameInput = (value: string) =>
    value.replace(/[^a-zA-Z\s'-]/g, "");
  const sanitizePhoneInput = (value: string) =>
    value.replace(/[^0-9+()\s-]/g, "");
  const sanitizeEmailInput = (value: string) => value.replace(/\s/g, "");

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeNameInput(event.target.value);
    setFirstName(sanitizedValue);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeNameInput(event.target.value);
    setLastName(sanitizedValue);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeEmailInput(event.target.value);
    setEmail(sanitizedValue);
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizePhoneInput(event.target.value);
    setPhone(sanitizedValue);
  };

  const formattedRole = role
    ? role
        .toLowerCase()
        .split("_")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ")
    : null;
  const RefreshData = () => {
    revalidateStaffs();
  };

  // updateo staffo
  const UpdateStaff = async () => {
    if (role === "") {
      toast({
        status: "error",
        description: "Staff Role is null, please specify role",
        variant: "destructive",
      });
      return;
    }

    try {
      const staffData = {
        is_active: isActive,
        role_name: (role as string).toLowerCase(),
      };

      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        country_alpha2_code: "US",
        dob: "2000-01-01",
        has_marketing_email_consent: false,
        has_sms_consent: false,
      };

      const staffError = await updateStaff(StaffData?.ID!, staffData, jwt!);
      const userError = await updateUser(StaffData?.ID!, userData, jwt!);

      if (staffError === null && userError === null) {
        toast({
          status: "success",
          description: "Staff member updated successfully",
        });
        RefreshData();
        onClose?.();
      } else {
        toast({
          status: "error",
          description: staffError || userError || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to save staff", err);
      toast({
        status: "error",
        description: "Request Failed",
        variant: "destructive",
      });
    }
  };

  const DeleteStaff = async () => {
    try {
      await deleteStaff(StaffData?.ID!, jwt!);
      toast({
        status: "success",
        description: "Staff member deleted successfully",
      });
      RefreshData();
      onClose?.();
    } catch (err) {
      toast({
        status: "error",
        description: "Error deleting staff",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab Navigation */}
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <FileText className="h-4 w-4" />
              Staff Information
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Details Tab */}
        <TabsContent value="details" className="pt-4">
          <div className="space-y-6">
            {/* Header Section with Profile Picture */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="flex flex-col gap-6 pt-6 md:flex-row md:items-start">
                <div className="flex-shrink-0">
                  {StaffData && (
                    <StaffProfilePictureUpload
                      staffData={StaffData}
                      currentPhotoUrl={profilePicture}
                      isOwnProfile={user?.ID === StaffData.ID}
                      isAdmin={
                        user?.StaffInfo?.Role === StaffRoleEnum.ADMIN ||
                        user?.StaffInfo?.Role === StaffRoleEnum.SUPERADMIN
                      }
                      onPhotoUpdate={(url) => setProfilePicture(url)}
                    />
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {firstName} {lastName}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {formattedRole ? (
                        <Badge className="border-primary/20 bg-primary/10 text-primary">
                          {formattedRole}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="border-dashed border-border bg-transparent text-muted-foreground"
                        >
                          No Role Assigned
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-transparent",
                          isActive
                            ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-rose-500/15 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        )}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{phone || "No phone provided"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Section */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={firstName}
                        onChange={handleFirstNameChange}
                        className="bg-background"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={lastName}
                        onChange={handleLastNameChange}
                        className="bg-background"
                        placeholder="Enter last name"
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="bg-background"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        value={phone}
                        onChange={handlePhoneChange}
                        className="bg-background"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role & Status Section */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-lg">Role & Status</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Staff Role <span className="text-red-500">*</span>
                      </label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="bg-background">
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
                      <label className="text-sm font-medium">
                        Account Status
                      </label>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {isActive ? "Active account" : "Inactive account"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isActive
                              ? "User can access the system"
                              : "User cannot access the system"}
                          </div>
                        </div>
                        <Switch
                          checked={isActive}
                          onCheckedChange={setIsActive}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="pt-4">
          <div className="space-y-6">
            <div className="text-center text-muted-foreground py-8">
              Activity history will be shown here in future updates
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Staff
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this staff member? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={DeleteStaff}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
          onClick={(e) => UpdateStaff()}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
