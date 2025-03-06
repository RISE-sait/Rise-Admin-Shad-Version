"use client";

import React from "react";
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

export function SummaryCards({ selectedYear, setSelectedYear }: SummaryCardsProps) {
  const summaryDataByYear: Record<string, { title: string; value: string | number; icon: React.ReactNode }[]> = {
    "2022": [
      { title: "Total Revenue", value: "$500,000", icon: <DollarSign size={24} color="#4CAF50" /> },
      { title: "New Customers", value: "1,200", icon: <User size={24} color="#2196F3" /> },
      { title: "Pending", value: "$5,000", icon: <RefreshCcw size={24} color="#FFC107" /> },
      { title: "Failed Transactions", value: "65", icon: <XOctagon size={24} color="#f44336" /> },
    ],
    "2023": [
      { title: "Total Revenue", value: "$620,000", icon: <DollarSign size={24} color="#4CAF50" /> },
      { title: "New Customers", value: "1,500", icon: <User size={24} color="#2196F3" /> },
      { title: "Pending", value: "$6,200", icon: <RefreshCcw size={24} color="#FFC107" /> },
      { title: "Failed Transactions", value: "80", icon: <XOctagon size={24} color="#f44336" /> },
    ],
    "2024": [
      { title: "Total Revenue", value: "$750,000", icon: <DollarSign size={24} color="#4CAF50" /> },
      { title: "New Customers", value: "1,800", icon: <User size={24} color="#2196F3" /> },
      { title: "Pending", value: "$7,500", icon: <RefreshCcw size={24} color="#FFC107" /> },
      { title: "Failed Transactions", value: "95", icon: <XOctagon size={24} color="#f44336" /> },
    ],
  };

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
        {summaryDataByYear[selectedYear].map((data, index) => (
          <SummaryCard key={index} title={data.title} value={data.value} icon={data.icon} />
        ))}
      </div>
    </div>
  );
}
