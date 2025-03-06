"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCards } from "./SummaryCard";
import { SalesChart } from "./SalesChart";
import { UsersChart } from "./UsersChart";

export default function FinancialsPage() {
  const [selectedYear, setSelectedYear] = useState("2022");
  const { theme } = useTheme(); 

  return (
    <div className={`container mx-auto py-10 transition-all ${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-800"}`}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Financials</h1>
        <p className="text-gray-500 dark:text-gray-300">Analyze sales trends & user growth.</p>
      </header>

      {/* Pass selectedYear and setSelectedYear */}
      <SummaryCards selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

      {/* Tabbed Charts Section */}
      <Tabs defaultValue="users" className="mt-10">
        <TabsList className="mb-4 dark:bg-gray-800 dark:text-white">
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
