// this is a template for the RevenueAreaChart component.

// "use client";

// import React from "react";
// import { Line } from "react-chartjs-2";
// import { useTheme } from "next-themes";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// interface RevenueAreaChartProps {
//   selectedYear: string;
// }

// export function RevenueAreaChart({ selectedYear }: RevenueAreaChartProps) {
//   const { theme } = useTheme();

//   const revenueDataByYear: Record<string, number[]> = {
//     "2022": [12000, 14000, 16000],
//     "2023": [13000, 15000, 17000],
//     "2024": [15000, 18000, 20000],
//   };

//   const data = {
//     labels: ["Q1", "Q2", "Q3"],
//     datasets: [
//       {
//         label: "Cumulative Revenue",
//         data: revenueDataByYear[selectedYear] || [],
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         fill: true,
//       },
//     ],
//   };

//   return <Line data={data} />;
// }
