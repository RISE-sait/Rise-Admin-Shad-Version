"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { PlusIcon, Search } from 'lucide-react'
import StaffTable from '@/components/staff/StaffTable'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import StaffForm from '@/components/staff/StaffForm'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/ui/AlertModal' // Adjust import as needed
import { toast } from '@/hooks/use-toast'
import { createStaff, getAllStaffs } from '@/services/staff'
import { revalidateStaffs } from '@/app/actions/serverActions'
import { User } from '@/types/user'

export default function StaffPage({staffs}: {staffs: User[]}) {

  const [selectedStaff, setSelectedStaff] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isNewStaff, setIsNewStaff] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const handleStaffSelect = (staffMember: User) => {
    setSelectedStaff(staffMember)
    setIsNewStaff(false)
    setDrawerOpen(true)
  }

  const handleAddNewClick = () => {
    setSelectedStaff(null)
    setIsNewStaff(true)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      setSelectedStaff(null)
      setIsNewStaff(false)
    }, 300)
  }

  const handleBulkDelete = async () => {
    // try {
    //   setLoading(true)
    //   await Promise.all(selectedIds.map(id => ApiService.staffs.staffsDelete(id)))
    //   toast({
    //     status: "success",
    //     description: "Selected staff members deleted successfully.",
    //   })
    //   setSelectedIds([])
    //   fetchStaff(true)
    // } catch (error) {
    //   console.error('Error deleting staff:', error)
    //   toast({
    //     status: "error",
    //     description: "Failed to delete staff members.",
    //   })
    // } finally {
    //   setLoading(false)
    //   setBulkDeleteOpen(false)
    // }
  }

  const filteredStaff = staffs.filter(member => 
    member.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.StaffInfo!.Role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title={`Staff`} description="Manage your staff members and their roles" />
        <Button onClick={handleAddNewClick} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Staff
        </Button>
      </div>
      <Separator />
      
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setBulkDeleteOpen(true)}
            className="ml-4"
          >
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>
      
      <StaffTable 
        data={filteredStaff} 
        loading={false}
        onStaffSelect={handleStaffSelect}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      
      <AlertModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={false}
      />
      
      <Sheet 
        open={drawerOpen} 
        onOpenChange={(open) => { if (!open) handleDrawerClose() }}
      >
        {selectedStaff && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
        <SheetContent className="w-full sm:max-w-md md:max-w-xl overflow-y-auto pb-0">
          {isNewStaff ? (
            <StaffForm 
              onSubmit={async (data) => {
                // try {
                //   await createStaff(data)
                //   toast({
                //     status: "success",
                //     description: "Staff member created successfully."
                //   })
                //   setDrawerOpen(false)
                //   setTimeout(() => fetchStaff(true), 500)
                // } catch (error) {
                //   console.error('Error creating staff:', error)
                //   toast({
                //     status: "error",
                //     description: "Failed to create staff member."
                //   })
                // }
              }}
            />
          ) : selectedStaff ? (
            <StaffForm 
              initialData={selectedStaff}
              onSubmit={async (data) => {
                // try {
                //   await ApiService.staffs.staffsUpdate(selectedStaff.id!, data)
                //   toast({
                //     status: "success",
                //     description: "Staff member updated successfully."
                //   })
                //   setDrawerOpen(false)
                //   setTimeout(() => fetchStaff(true), 500)
                // } catch (error) {
                //   console.error('Error updating staff:', error)
                //   toast({
                //     status: "error",
                //     description: "Failed to update staff member."
                //   })
                // }
              }}
              onDelete={async () => {
                
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}