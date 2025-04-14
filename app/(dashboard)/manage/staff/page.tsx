import React from 'react'
import { getAllStaffs } from '@/services/staff'
import StaffPage from '@/components/staff/StaffPage'
import RoleProtected from '@/components/RoleProtected';

export default async function Page() {
  const staffs = await getAllStaffs()
  return(
  <RoleProtected  allowedRoles={[ 'SUPERADMIN']}>
   <StaffPage staffs={staffs} />
  </RoleProtected>
  );
}