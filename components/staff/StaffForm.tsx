"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StaffRequestDto, StaffResponseDto } from "@/app/api/Api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "./toast"
import { ApiService } from "@/app/api/ApiService"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, UserIcon, Save, Trash } from "lucide-react"
import { AlertModal } from "@/components/ui/AlertModal"

// Schema for new staff registration
const newStaffSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(16, "Staff members must be at least 16 years old"),
  phone_number: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  country_code: z.string().default("ca"),
  is_active_staff: z.boolean().default(true),
});

// Schema for updating existing staff
const updateStaffSchema = z.object({
  is_active: z.boolean().default(true),
  role_name: z.string().min(1, "Role is required"),
});

interface StaffFormProps {
  initialData?: StaffResponseDto;
  onSubmit?: (data: any) => Promise<void>;
  loading?: boolean;
  onDelete?: () => void;
}

type EditFormValues = {
  is_active: boolean;
  role_name: string;
}

type CreateFormValues = {
  first_name: string;
  last_name: string;
  age: number;
  phone_number: string;
  role: string;
  country_code: string;
  is_active_staff: boolean;
}
type FormValues = EditFormValues | CreateFormValues;

export default function StaffForm({ initialData, onSubmit: externalSubmit, loading: externalLoading, onDelete }: StaffFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();
  const isEditing = !!initialData;
  
  const schema = isEditing ? updateStaffSchema : newStaffSchema;
  
  const defaultValues = isEditing ? {
    is_active: initialData?.is_active ?? true,
    role_name: initialData?.role_name ?? "",
  } : {
    first_name: "",
    last_name: "",
    age: 25,
    phone_number: "",
    role: "ADMIN",
    country_code: "ca",
    is_active_staff: true,
  };

  const form = useForm<FormValues>({
    // @ts-ignore - TypeScript limitation with conditional types
    resolver: zodResolver(schema),
    defaultValues: isEditing ? {
      is_active: initialData?.is_active ?? true,
      role_name: initialData?.role_name ?? "",
    } : {
      first_name: "",
      last_name: "",
      age: 25,
      phone_number: "",
      role: "ADMIN",
      country_code: "ca",
      is_active_staff: true,
    },
  });

  async function onSubmit(values: any) {
    if (externalSubmit) {
      await externalSubmit(values);
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && initialData?.id) {
        const data: StaffRequestDto = {
          is_active: values.is_active,
          role_name: values.role_name,
        };
        await ApiService.staffs.staffsUpdate(initialData.id, data);
        toast({
          title: "Success",
          description: "Staff member updated successfully."
        });
      } else {
        const data = {
          first_name: values.first_name,
          last_name: values.last_name,
          age: Number(values.age),
          phone_number: values.phone_number || "",
          role: values.role,
          country_code: values.country_code || "ca",
          is_active_staff: values.is_active_staff
        };
        await ApiService.register.staffCreate(data);
        toast({
          title: "Success",
          description: "Staff member created successfully."
        });
      }

      router.push("/manage/staff");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} staff member.`
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = async () => {
    if (onDelete) {
      await onDelete();
    } else if (initialData?.id) {
      try {
        setLoading(true);
        await ApiService.staffs.staffsDelete(initialData.id);
        toast({
          title: "Success",
          description: "Staff member deleted successfully."
        });
        router.push("/manage/staff");
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete staff member."
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const isSubmitting = loading || externalLoading;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b mb-6">
          <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1">
            <TabsTrigger 
              value="details"
              className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
            >
              <FileText className="h-4 w-4" />
              Information
            </TabsTrigger>
            {isEditing && (
              <TabsTrigger 
                value="activity"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent hover:bg-muted/50 transition-all"
              >
                <UserIcon className="h-4 w-4" />
                Activity
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="details" className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Age" 
                              {...field} 
                              disabled={isSubmitting} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+15141234567" 
                              {...field} 
                              disabled={isSubmitting} 
                            />
                          </FormControl>
                          <FormDescription>
                            Format: +[country code][number] (e.g., +15141234567)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                              <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                              <SelectItem value="TRAINER">Trainer</SelectItem>
                              <SelectItem value="COACH">Coach</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_active_staff"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                          <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <FormDescription>
                              Set if this staff member is currently active
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Display Info Section */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-base">Staff Information</h3>
                      <p className="text-sm text-muted-foreground">View basic information about this staff member</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-medium">Name</div>
                        <div className="mt-1">{initialData?.first_name} {initialData?.last_name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Email</div>
                        <div className="mt-1">{initialData?.email || "—"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Phone</div>
                        <div className="mt-1">{initialData?.phone || "—"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Created</div>
                        <div className="mt-1">
                          {initialData?.created_at ? new Date(initialData.created_at).toLocaleDateString() : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Edit Section */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-base">Edit Details</h3>
                      <p className="text-sm text-muted-foreground">Update the staff member information</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="role_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                                <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                                <SelectItem value="TRAINER">Trainer</SelectItem>
                                <SelectItem value="COACH">Coach</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                Determine if this staff member is currently active
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </form>
          </Form>
        </TabsContent>
        
        {isEditing && (
          <TabsContent value="activity" className="pt-4">
            <div className="space-y-6">
              <div className="text-center text-muted-foreground py-8">
                Activity history will be shown here in future updates
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t z-10 mt-8">
        <div className="max-w-full px-4 mx-auto flex justify-between items-center">
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Last updated: {initialData?.updated_at ? new Date(initialData.updated_at).toLocaleString() : 'Never'}
            </p>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(true)}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : (isEditing ? "Save Changes" : "Create Staff")}
            </Button>
          </div>
        </div>
      </div>

      <AlertModal 
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteClick}
        loading={Boolean(isSubmitting)}
      />
    </div>
  )
}