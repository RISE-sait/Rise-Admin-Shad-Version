"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCards } from "./SummaryCard";
import { SalesChart } from "./SalesChart";
import { UsersChart } from "./UsersChart";
// import { RevenueBreakdownChart } from "./RevenueBreakdownChart"; 
// import { PerformanceBarChart } from "./PerformanceBarChart"; 
// import { RevenueAreaChart } from "./RevenueAreaChart"; 

export default function FinancialsPage() {
  const [selectedYear, setSelectedYear] = useState("2022");
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} //
      className={`container mx-auto py-10 transition-all ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-800"
      }`}
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Financials</h1>
        <p className="text-gray-500 dark:text-gray-300">
          Analyze sales trends & user growth.
        </p>
      </header>

      {/* Pass selectedYear and setSelectedYear */}
      <SummaryCards selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

      {/* Tabbed Charts Section */}
      <Tabs defaultValue="users" className="mt-10">
        <TabsList className="mb-4 dark:bg-gray-800 dark:text-white">
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="cumulative">Cumulative Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <UsersChart selectedYear={selectedYear} />
          </motion.div>
        </TabsContent>

        <TabsContent value="sales">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <SalesChart selectedYear={selectedYear} />
          </motion.div>
        </TabsContent>

        {/* <TabsContent value="revenue">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <RevenueBreakdownChart selectedYear={selectedYear} />
          </motion.div>
        </TabsContent>

        <TabsContent value="performance">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <PerformanceBarChart selectedYear={selectedYear} />
          </motion.div>
        </TabsContent>

        <TabsContent value="cumulative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <RevenueAreaChart selectedYear={selectedYear} />
          </motion.div>
        </TabsContent> */}

      </Tabs>
    </motion.div>
  );
}
