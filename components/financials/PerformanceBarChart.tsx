// This is a template for the PerformanceBarChart component.

// "use client";

// import React from "react";
// import { Bar } from "react-chartjs-2";
// import { useTheme } from "next-themes";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// interface PerformanceChartProps {
//   selectedYear: string;
// }

// export function PerformanceBarChart({ selectedYear }: PerformanceChartProps) {
//   const { theme } = useTheme();

//   const performanceDataByYear: Record<string, { actual: number[]; target: number[] }> = {
//     "2022": { actual: [120, 150, 180], target: [130, 160, 200] },
//     "2023": { actual: [140, 170, 190], target: [150, 180, 210] },
//     "2024": { actual: [160, 180, 200], target: [170, 200, 230] },
//   };

//   const data = {
//     labels: ["Q1", "Q2", "Q3"],
//     datasets: [
//       {
//         label: "Actual Performance",
//         data: performanceDataByYear[selectedYear].actual || [],
//         backgroundColor: "#4CAF50",
//       },
//       {
//         label: "Target Performance",
//         data: performanceDataByYear[selectedYear].target || [],
//         backgroundColor: "#FF9800",
//       },
//     ],
//   };

//   return <Bar data={data} />;
// }
