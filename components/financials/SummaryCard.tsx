"use client";

import React from "react";
import { useTheme } from "next-themes";
import { DollarSign, User, RefreshCcw, XOctagon } from "lucide-react";

interface SummaryCardsProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => {
  const { theme } = useTheme(); 
  
  return (
    <div
      className={`border rounded-lg p-4 shadow-md flex-1 transition-all
      ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"}`}
    >
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <div>
          <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export function SummaryCards({ selectedYear, setSelectedYear }: SummaryCardsProps) {
  const { theme } = useTheme();

  const summaryDataByYear: Record<string, { title: string; value: string | number; icon: React.ReactNode }[]> = {
    "2022": [
      { title: "Total Revenue", value: "$137,000", icon: <DollarSign size={24} color="#4CAF50" /> },
      { title: "New Customers", value: "126", icon: <User size={24} color="#2196F3" /> },
      { title: "Pending", value: "$1,019", icon: <RefreshCcw size={24} color="#FFC107" /> },
      { title: "Failed Transactions", value: "6", icon: <XOctagon size={24} color="#f44336" /> },
    ],
    "2023": [
      { title: "Total Revenue", value: "$152,000", icon: <DollarSign size={24} color="#4CAF50" /> },
      { title: "New Customers", value: "138", icon: <User size={24} color="#2196F3" /> },
      { title: "Pending", value: "$1,285", icon: <RefreshCcw size={24} color="#FFC107" /> },
      { title: "Failed Transactions", value: "8", icon: <XOctagon size={24} color="#f44336" /> },
    ],
    "2024": [
      { title: "Total Revenue", value: "$164,000", icon: <DollarSign size={24} color="#4CAF50" /> },
      { title: "New Customers", value: "157", icon: <User size={24} color="#2196F3" /> },
      { title: "Pending", value: "$1,430", icon: <RefreshCcw size={24} color="#FFC107" /> },
      { title: "Failed Transactions", value: "11", icon: <XOctagon size={24} color="#f44336" /> },
    ],
  };

  return (
    <div>
      {/* Year Selection Dropdown */}
      <div className="mb-5">
        <select
          className={`border p-2 pr-4 rounded-md transition-all 
            ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300"}`}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4">
        {summaryDataByYear[selectedYear].map((data, index) => (
          <SummaryCard key={index} title={data.title} value={data.value} icon={data.icon} />
        ))}
      </div>
    </div>
  );
}
