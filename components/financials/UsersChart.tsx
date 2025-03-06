"use client";

import React, { useRef, useEffect, useState } from "react";
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
  Filler, 
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface UsersChartProps {
  selectedYear: string;
}

export function UsersChart({ selectedYear }: UsersChartProps) {
  const { theme } = useTheme();
  const chartRef = useRef(null);
  const [gradientColor, setGradientColor] = useState<string>("rgba(30, 144, 255, 0.2)"); 

  const usersDataByYear: Record<string, number[]> = {
    "2022": [40, 60, 55, 75, 70, 50, 77, 65, 79, 58, 62, 74],
    "2023": [45, 55, 63, 72, 69, 55, 80, 68, 75, 60, 67, 73],
    "2024": [50, 70, 60, 80, 75, 52, 78, 70, 85, 65, 66, 72],
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current as any;
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      
      gradient.addColorStop(0, "rgba(30, 144, 255, 0.6)"); 
      gradient.addColorStop(1, "rgba(30, 144, 255, 0.1)"); 

      setGradientColor(gradient);
    }
  }, [theme]);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "New Users",
        data: usersDataByYear[selectedYear] || [],
        borderColor: "rgba(30, 144, 255, 1)",
        backgroundColor: gradientColor, 
        tension: 0.3,
        fill: true,
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
        text: `Monthly User Growth - ${selectedYear}`,
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
          color: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(150, 150, 150, 0.5)",
        },
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  };

  return (
    <div className={`p-4 rounded-lg transition-all ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
