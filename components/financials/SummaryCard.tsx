"use client";

import React, { useState } from "react";
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

// Placeholder summary data for different years
const summaryDataByYear: { [year: string]: { title: string; value: string | number; icon: React.ReactNode }[] } = {
  "2022": [
    { title: "Total Revenue", value: "$126,000", icon: <DollarSign size={24} color="#4CAF50" /> },
    { title: "New Customers", value: "113", icon: <User size={24} color="#2196F3" /> },
    { title: "Pending", value: "$1,074", icon: <RefreshCcw size={24} color="#FFC107" /> },
    { title: "Failed Transactions", value: "6", icon: <XOctagon size={24} color="#f44336" /> },
  ],
  "2023": [
    { title: "Total Revenue", value: "$132,000", icon: <DollarSign size={24} color="#4CAF50" /> },
    { title: "New Customers", value: "128", icon: <User size={24} color="#2196F3" /> },
    { title: "Pending", value: "$1,240", icon: <RefreshCcw size={24} color="#FFC107" /> },
    { title: "Failed Transactions", value: "8", icon: <XOctagon size={24} color="#f44336" /> },
  ],
  "2024": [
    { title: "Total Revenue", value: "$158,000", icon: <DollarSign size={24} color="#4CAF50" /> },
    { title: "New Customers", value: "165", icon: <User size={24} color="#2196F3" /> },
    { title: "Pending", value: "$1,906", icon: <RefreshCcw size={24} color="#FFC107" /> },
    { title: "Failed Transactions", value: "14", icon: <XOctagon size={24} color="#f44336" /> },
  ],
};

export function SummaryCards() {
  const [selectedYear, setSelectedYear] = useState("2022");

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

export default SummaryCard;
