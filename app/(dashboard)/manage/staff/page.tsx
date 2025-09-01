import React from "react";
import { getAllStaffs } from "@/services/staff";
import StaffPage from "@/components/staff/StaffPage";
import PendingStaffContainer from "@/components/pending-staff/PendingStaffContainer";
import RoleProtected from "@/components/RoleProtected";

export default async function Page() {
  const staffs = await getAllStaffs();
  return (
    <RoleProtected>
      <div className="flex flex-col">
        <StaffPage staffs={staffs} />
        <PendingStaffContainer />
      </div>
    </RoleProtected>
  );
}
