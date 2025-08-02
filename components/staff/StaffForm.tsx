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
import { FileText, Trash, Save } from "lucide-react";
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
              Information
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Details Tab */}
        <TabsContent value="details" className="pt-4">
          {/* Staff Information Form */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-base">Staff Information</h3>
              <p className="text-sm text-muted-foreground">
                Update the staff member information
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
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

              <div className="flex flex-row items-center justify-between p-4 border rounded-md">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Active Status</div>
                  <div className="text-sm text-muted-foreground">
                    Determine if this staff member is currently active
                  </div>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
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
