import React from 'react'
import { getAllStaffs } from '@/services/staff'
import StaffPage from '@/components/staff/StaffPage'
import RoleProtected from '@/components/RoleProtected';

export default async function Page() {

  const staffs = await getAllStaffs()

  return(
  <RoleProtected  allowedRoles={[ 'SUPERADMIN']} fallback={<h1 className="text-center text-2xl">Access Denied</h1>}>
   <StaffPage staffs={staffs} />
  </RoleProtected>
  );

}