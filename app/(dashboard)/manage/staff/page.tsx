import React from 'react'
import { getAllStaffs } from '@/services/staff'
import StaffPage from '@/components/staff/StaffPage'

export default async function Page() {

  const staffs = await getAllStaffs()

  return <StaffPage staffs={staffs} />

}