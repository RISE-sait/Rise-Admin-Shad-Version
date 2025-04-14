'use client'

import React, { useState } from 'react'
import { Heading } from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import StaffTable from '@/components/staff/StaffTable'
import StaffForm from '@/components/staff/StaffForm'
import { User } from '@/types/user'

export default function StaffPage({ staffs }: { staffs: User[],  },) {
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isNewStaff, setIsNewStaff] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleStaffSelect = (staffMember: User) => {
    setSelectedStaff(staffMember)
    setIsNewStaff(false)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      setSelectedStaff(null)
      setIsNewStaff(false)
    }, 300)
  }

  const filteredStaff = staffs.filter(member =>
    member.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.StaffInfo!.Role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Staff" description="Manage your staff members and their roles" />
      </div>
      <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      <Separator />

      <StaffTable
        data={filteredStaff}
        loading={false}
        onStaffSelect={handleStaffSelect}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <Sheet
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) handleDrawerClose()
        }}
      >
        {selectedStaff && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
        <SheetContent className="w-full sm:max-w-md md:max-w-xl overflow-y-auto pb-0">
          {isNewStaff ? (
            <StaffForm />
          ) : selectedStaff ? (
            <StaffForm StaffData={selectedStaff} />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
