"use client";

import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Trash, Save, User as UserIcon } from "lucide-react";
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
import getValue from "@/configs/constants";
import { useToast } from "@/hooks/use-toast";
import { revalidateStaffs } from "@/actions/serverActions";
import { deleteStaff, updateStaff } from "@/services/staff";
import { updateUser } from "@/services/user";
import { StaffRoleEnum, User } from "@/types/user";

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
  const [profilePicture, setProfilePicture] = useState(StaffData?.PhotoUrl || "");

  const { user } = useUser();
  const jwt = user?.Jwt;
  const { toast } = useToast();
  const apiUrl = getValue("API");

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
          {/* Modern Staff Information Layout */}
          <div className="space-y-8">

            {/* Header Section with Profile Picture */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-8 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-8">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {StaffData && (
                    <StaffProfilePictureUpload
                      staffData={StaffData}
                      currentPhotoUrl={profilePicture}
                      isOwnProfile={user?.ID === StaffData.ID}
                      isAdmin={user?.StaffInfo?.Role === StaffRoleEnum.ADMIN || user?.StaffInfo?.Role === StaffRoleEnum.SUPERADMIN}
                      onPhotoUpdate={(url) => setProfilePicture(url)}
                    />
                  )}
                </div>

                {/* Staff Overview */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {firstName} {lastName}
                    </h2>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                      {role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'No Role Assigned'}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>Staff Member</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Update the staff member's personal details and settings
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Role and Status */}
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Role & Status
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Staff Role *
                      </label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="h-11">
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
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Account Status
                      </label>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {isActive ? 'Active Account' : 'Inactive Account'}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {isActive ? 'User can access the system' : 'User cannot access the system'}
                          </div>
                        </div>
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-full px-4 mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 ml-auto">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={(e) => UpdateStaff()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this staff member? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={DeleteStaff}>
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
