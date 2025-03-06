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
interface UsersChartProps {
  selectedYear: string;
}

export function UsersChart({ selectedYear }: UsersChartProps) {
  const usersDataByYear: Record<string, number[]> = {
    "2022": [40, 60, 55, 75, 70, 50, 77, 65, 79, 58, 62, 74],
    "2023": [45, 55, 63, 72, 69, 55, 80, 68, 75, 60, 67, 73],
    "2024": [50, 70, 60, 80, 75, 52, 78, 70, 85, 65, 66, 72],
  };

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "New Users",
        data: usersDataByYear[selectedYear] || [], 
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}
