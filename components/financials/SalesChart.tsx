"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SalesChartProps {
  selectedYear: string;
}

export function SalesChart({ selectedYear }: SalesChartProps) {
  const { theme } = useTheme(); 

  const salesDataByYear: Record<string, number[]> = {
    "2022": [12500, 14000, 13500, 16000, 13000, 17000, 14500, 16500, 15500, 18500, 16000, 17000],  
    "2023": [14000, 12000, 15500, 17500, 13500, 18500, 17000, 19500, 16000, 22500, 19000, 16000],  
    "2024": [15500, 17000, 14500, 20000, 15000, 22500, 17500, 19000, 22000, 19500, 23500, 19000],  
  };

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: salesDataByYear[selectedYear] || [],
        borderColor: theme === "dark" ? "rgba(75, 192, 192, 1)" : "rgba(75, 192, 192, 1)", 
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      title: {
        display: true,
        text: `Monthly Sales Trend - ${selectedYear}`,
        color: theme === "dark" ? "#ffffff" : "#000000", 
      },
    },
    scales: {
      x: {
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(200, 200, 200, 0.5)", 
        },
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      y: {
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(200, 200, 200, 0.5)",
        },
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  };

  return (
    <div className={`p-4 rounded-lg transition-all ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <Line data={data} options={options} />
    </div>
  );
}
