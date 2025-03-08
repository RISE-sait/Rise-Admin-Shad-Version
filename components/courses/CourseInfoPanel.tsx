"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Course } from "@/types/course";
import DetailsTab from "./infoTabs/Details";

export default function CourseInfoPanel({ course }: { course: Course }) {
  const [tabValue, setTabValue] = useState("details");

  return (
    <Tabs value={tabValue} onValueChange={setTabValue}>
      <TabsList className="w-full">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <DetailsTab course={course} />
      </TabsContent>
    </Tabs>
  );
}
