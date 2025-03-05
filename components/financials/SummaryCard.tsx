"use client"

import React, { useState } from "react"
import { DollarSign, User, RefreshCcw, XOctagon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white flex-1">
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
};

// Summary Cards Wrapper Component
export function SummaryCards() {
  const [selectedYear, setSelectedYear] = useState("2022");

  const chartDataByYear: { [year: string]: number[] } = {
    "2022": [30, 20, 50, 40, 60, 70, 50, 90, 65, 60, 55, 40],
    "2023": [35, 25, 75, 45, 55, 75, 85, 55, 75, 55, 55, 35],
    "2024": [35, 25, 55, 45, 55, 90, 85, 55, 65, 45, 55, 35],
  };

  // Helper function to format numbers as currency
  const formatCurrency = (num: number) => `$${num.toLocaleString()}`;

  // Compute summary data dynamically based on the selected year
  const computeSummaryData = (year: string) => {
    const data = chartDataByYear[year];
    const sum = data.reduce((a, b) => a + b, 0);
    const totalSales = sum * 200; // Assume each unit represents $200 in sales
    const newCustomers = Math.floor(sum / 6); // Example calculation
    const refunds = totalSales * 0.02;
    const failedTransactions = Math.floor(sum / 60);

    return [
      { title: "Total Revenue", value: formatCurrency(totalSales), icon: <DollarSign size={24} color="#4CAF50" /> },
      { title: "New Customers", value: newCustomers, icon: <User size={24} color="#2196F3" /> },
      { title: "Refunds", value: formatCurrency(refunds), icon: <RefreshCcw size={24} color="#FFC107" /> },
      { title: "Failed Transactions", value: failedTransactions, icon: <XOctagon size={24} color="#f44336" /> },
    ];
  };

  const summaryData = computeSummaryData(selectedYear);

  return (
    <div>
      <div className="mb-4">
        <select
          className="border p-2 rounded-md"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-4">
        {summaryData.map((data, index) => (
          <SummaryCard key={index} title={data.title} value={data.value} icon={data.icon} />
        ))}
      </div>
    </div>
  );
}

export default SummaryCard;
