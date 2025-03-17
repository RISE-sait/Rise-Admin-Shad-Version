"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StaffRegistrationRequestDto } from "@/app/api/Api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
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
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(16, "Staff members must be at least 16 years old"),
  phone_number: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  is_active_staff: z.boolean().default(true),
})

export default function NewStaffPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      age: 25,
      phone_number: "",
      role: "",
      is_active_staff: true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const data: StaffRegistrationRequestDto = {
        first_name: values.first_name,
        last_name: values.last_name,
        age: values.age,
        phone_number: values.phone_number,
        role: values.role,
        is_active_staff: values.is_active_staff,
      }

      await ApiService.register.staffCreate(data)
      toast({
        title: "Success",
        description: "Staff member created successfully."
      })
      router.push("staff")
      router.refresh()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create staff member."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push('/staff')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="ml-4">
          <Heading title="Add New Staff Member" description="Create a new staff member account" />
        </div>
      </div>
      <Separator />

      <div className="max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} disabled={loading} />
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
                      <Input placeholder="Last name" {...field} disabled={loading} />
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
                        disabled={loading} 
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
                        disabled={loading} 
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
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Coach">Coach</SelectItem>
                        <SelectItem value="Instructor">Instructor</SelectItem>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Receptionist">Receptionist</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The role determines access level and responsibilities
                    </FormDescription>
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
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={() => router.push('/staff')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Staff"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}