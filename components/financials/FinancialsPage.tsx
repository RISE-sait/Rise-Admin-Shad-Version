"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCards } from "./SummaryCard";
import { SalesChart } from "./SalesChart";
import { UsersChart } from "./UsersChart";

export default function FinancialsPage() {
  // 📌 Manage selected year at the top level
  const [selectedYear, setSelectedYear] = useState("2022");

  return (
    <div className="container mx-auto py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Financials</h1>
        <p className="text-gray-600">
          Analyze your overall performance, including sales trends and user growth.
        </p>
      </header>

      {/* 📌 Pass selectedYear and setSelectedYear */}
      <SummaryCards selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

      {/* 📌 Tabbed Charts Section */}
      <Tabs defaultValue="users" className="mt-10">
        <TabsList>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersChart selectedYear={selectedYear} />
        </TabsContent>
        <TabsContent value="sales">
          <SalesChart selectedYear={selectedYear} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
