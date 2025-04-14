"use client";

import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Trash, Save } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import getValue from '@/configs/constants';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from "next/navigation";

enum StaffRole {
  Trainer = "trainer",
  Coach = "coach",
  Admin = "admin",
  Superadmin = "superadmin",
  Barber = "barber",
  Instructor = "instructor",
  Receptionist = "receptionist"
}

const ROLE_OPTIONS = Object.entries(StaffRole).map(([key, value]) => ({
  label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  value,
}));

export default function StaffForm({ StaffData }: any) {
  const [activeTab, setActiveTab] = useState("details");
  const [role, setRole] = useState(StaffData?.StaffInfo.Role || "");
  const [isActive, setIsActive] = useState(StaffData.StaffInfo?.IsActive || false);

  console.log(StaffData)
  console.log(StaffData.StaffInfo.Role)

   const { user } = useUser();
   const jwt = user?.Jwt
   const { toast } = useToast();
   const apiUrl = getValue("API");
   const router = useRouter();

  const RefreshData = () => {
    router.refresh();
  }

  // updateo staffo
  const UpdateStaff = async() => {

    // ensure no nil values
    if (role == "" || role == null) {
      toast({
        status: "error",
        description: "Staff Role is null, please specify role",
        variant: "destructive"
      });
      return
    }

    console.log(jwt)
    console.log(isActive)

    try {
        const response = await fetch(`${apiUrl}/staffs/${StaffData.ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                is_active: isActive,
                role_name: role,
            })
        })
        if (!response.ok) {
            toast({
                status: "error",
                description: "Permission Denied or Request Failed",
                variant: "destructive"
            });
        } else {
            toast({
                status: "success",
                description: "Staff member updated successfully",
            });
            RefreshData()
        }
    } catch (err) {
        console.error("Failed to save plan", err);
    }
  }

  // deleto staffo 
  const DeleteStaff = async() => {
    try {
        const response = await fetch(`${apiUrl}/staffs/${StaffData.ID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`
            },
        })
        if (!response.ok) {
            toast({
                status: "error",
                description: "Permission Denied",
                variant: "destructive"
            });
        } else {
            toast({
                status: "success",
                description: "Staff member updated successfully",
            });
            RefreshData()
        }
    } catch (err) {
        console.error("Failed to save plan", err);
    }
  }

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
          {/* Staff Information Display */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-base">Staff Information</h3>
              <p className="text-sm text-muted-foreground">
                View basic information about this staff member
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium">Name</div>
                <div className="mt-1">{StaffData?.Name}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="mt-1">{StaffData?.Email}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Phone</div>
                <div className="mt-1">{StaffData?.Phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="mt-1">
                  {StaffData?.CreatedAt
                    ? new Date(StaffData.CreatedAt).toLocaleString()
                    : ""}
                </div>
              </div>
            </div>
          </div>

          <Separator className="mt-5" />

          {/* Edit Staff Details */}
          <div className="space-y-4 pt-5">
            <div>
              <h3 className="font-medium text-base">Edit Details</h3>
              <p className="text-sm text-muted-foreground">
                Update the staff member information
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Select */}
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

              {/* Active Switch */}
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
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={(e) => DeleteStaff()}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={(e) => UpdateStaff()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
