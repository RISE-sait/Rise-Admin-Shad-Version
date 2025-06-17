import React from "react";
import PendingStaffPage from "@/components/staff/PendingStaffPage";
import RoleProtected from "@/components/RoleProtected";

export default function Page() {
  return (
    <RoleProtected>
      <PendingStaffPage />
    </RoleProtected>
  );
}
