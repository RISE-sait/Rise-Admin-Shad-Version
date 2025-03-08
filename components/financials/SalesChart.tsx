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

interface SalesChartProps {
  selectedYear: string;
}

export function SalesChart({ selectedYear }: SalesChartProps) {
  const { theme } = useTheme();
  const chartRef = useRef<ChartJS<"line", number[], string> | null>(null);
  const [gradientColor, setGradientColor] = useState<string | CanvasGradient>("rgba(75, 192, 192, 0.2)");

  const salesDataByYear: Record<string, number[]> = {
    "2022": [12500, 14000, 13500, 16000, 13000, 17000, 14500, 16500, 15500, 18500, 16000, 17000],
    "2023": [14000, 12000, 15500, 17500, 13500, 18500, 17000, 19500, 16000, 22500, 19000, 16000],
    "2024": [15500, 17000, 14500, 20000, 15000, 22500, 17500, 19000, 22000, 19500, 23500, 19000],
  };

  useEffect(() => {
    if (chartRef.current) {
      const chartCanvas = chartRef.current as any;
      const ctx = chartCanvas.ctx;

      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(75, 192, 192, 0.6)"); 
        gradient.addColorStop(1, "rgba(75, 192, 192, 0.1)"); 

        setGradientColor(gradient);
      }
    }
  }, [theme]);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: salesDataByYear[selectedYear] || [],
        borderColor: "rgba(75, 192, 192, 1)",  
        backgroundColor: gradientColor, 
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointHoverRadius: 6,  
        pointRadius: 3,
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
      tooltip: {
        enabled: true,
        mode: "nearest" as const,
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        caretPadding: 10,
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
    hover: {
      mode: "nearest" as const,
      intersect: false,
    },
  };

  return (
    <div className={`p-4 rounded-lg transition-all ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
