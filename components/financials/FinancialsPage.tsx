"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryCards } from "./SummaryCard"
import { SalesChart } from "./SalesChart"
import { UsersChart } from "./UsersChart"

export default function FinancialsPage() {
  return (
    <div className="container mx-auto py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Financials</h1>
        <p className="text-gray-600">
          Analyze your overall performance, including sales trends and user growth.
        </p>
      </header>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Tabbed Charts Section */}
      <Tabs defaultValue="users" className="mt-10">
        <TabsList>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersChart />
        </TabsContent>
        <TabsContent value="sales">
          <SalesChart />
        </TabsContent>
      </Tabs>
    </div>
  )
}

//       {/* Advanced Chart Section */}
//       <div style={{ marginBottom: '40px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px' }}>
//         <AdvancedChart
//           selectedYear={selectedYear}
//           onYearChange={setSelectedYear}
//           chartDataByYear={chartDataByYear}
//         />
//       </div>
//     </div>
//   );
// }