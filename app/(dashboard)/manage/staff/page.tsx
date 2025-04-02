"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { PlusIcon, Search } from 'lucide-react'
import StaffTable from '@/components/staff/StaffTable'
import { StaffResponseDto } from '@/app/api/Api'
import { ApiService } from "@/app/api/ApiService"
import { toast } from '@/components/staff/toast'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import StaffForm from '@/components/staff/StaffForm'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/ui/AlertModal' // Adjust import as needed

const StaffPage = () => {
  const [staff, setStaff] = useState<StaffResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStaff, setSelectedStaff] = useState<StaffResponseDto | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isNewStaff, setIsNewStaff] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const fetchStaff = async (forceRefresh = false) => {
    try {
      setLoading(true)
      const timestamp = Date.now();
      let response = await ApiService.staffs.staffsList();
      console.log("Staff data fetched:", response.data)
      setStaff(response.data)
    } catch (error) {
      console.error('Error fetching staff:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load staff members."
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleStaffSelect = (staffMember: StaffResponseDto) => {
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
    try {
      setLoading(true)
      await Promise.all(selectedIds.map(id => ApiService.staffs.staffsDelete(id)))
      toast({
        title: "Success",
        description: "Selected staff members deleted successfully.",
      })
      setSelectedIds([])
      fetchStaff(true)
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete staff members.",
      })
    } finally {
      setLoading(false)
      setBulkDeleteOpen(false)
    }
  }

  const filteredStaff = staff.filter(member => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
        loading={loading}
        onStaffSelect={handleStaffSelect}
        onDelete={fetchStaff}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      
      <AlertModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={loading}
      />
      
      <Sheet 
        open={drawerOpen} 
        onOpenChange={(open) => { if (!open) handleDrawerClose() }}
      >
        {loading && selectedStaff && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
        <SheetContent className="w-full sm:max-w-md md:max-w-xl overflow-y-auto pb-0">
          {isNewStaff ? (
            <StaffForm 
              onSubmit={async (data) => {
                try {
                  await ApiService.register.staffCreate(data)
                  toast({
                    title: "Success",
                    description: "Staff member created successfully."
                  })
                  setDrawerOpen(false)
                  setTimeout(() => fetchStaff(true), 500)
                } catch (error) {
                  console.error('Error creating staff:', error)
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to create staff member."
                  })
                }
              }}
            />
          ) : selectedStaff ? (
            <StaffForm 
              initialData={selectedStaff}
              onSubmit={async (data) => {
                try {
                  await ApiService.staffs.staffsUpdate(selectedStaff.id!, data)
                  toast({
                    title: "Success",
                    description: "Staff member updated successfully."
                  })
                  setDrawerOpen(false)
                  setTimeout(() => fetchStaff(true), 500)
                } catch (error) {
                  console.error('Error updating staff:', error)
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update staff member."
                  })
                }
              }}
              onDelete={async () => {
                try {
                  await ApiService.staffs.staffsDelete(selectedStaff.id!)
                  toast({
                    title: "Success",
                    description: "Staff member deleted successfully."
                  })
                  setDrawerOpen(false)
                  setTimeout(() => fetchStaff(true), 500)
                } catch (error) {
                  console.error('Error deleting staff:', error)
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete staff member."
                  })
                }
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default StaffPage