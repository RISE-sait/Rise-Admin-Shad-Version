"use client";

import React from "react";
import { Line } from "react-chartjs-2";
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
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}
