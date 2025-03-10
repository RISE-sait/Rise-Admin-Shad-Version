// This is a template for the RevenueBreakdownChart component. 

// "use client";

// import React from "react";
// import { Pie } from "react-chartjs-2";
// import { useTheme } from "next-themes";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// interface RevenueBreakdownProps {
//   selectedYear: string;
// }

// export function RevenueBreakdownChart({ selectedYear }: RevenueBreakdownProps) {
//   const { theme } = useTheme();

//   const revenueDataByYear: Record<string, number[]> = {
//     "2022": [40, 30, 20, 10],
//     "2023": [35, 25, 25, 15],
//     "2024": [45, 20, 20, 15],
//   };

//   const data = {
//     labels: ["Product A", "Product B", "Product C", "Product D"],
//     datasets: [
//       {
//         data: revenueDataByYear[selectedYear] || [],
//         backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#FFC107"],
//         borderWidth: 2,
//         hoverOffset: 8, // Slight hover effect for better UI
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false, // Prevents chart from expanding too much
//     plugins: {
//       legend: {
//         display: true,
//         position: "bottom" as const,
//         labels: {
//           color: theme === "dark" ? "#ffffff" : "#000000",
//           padding: 12,
//           font: {
//             size: 14,
//           },
//         },
//       },
//       tooltip: {
//         backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.8)",
//         titleColor: theme === "dark" ? "#ffffff" : "#ffffff",
//         bodyColor: "#ffffff",
//         borderColor: theme === "dark" ? "#ffffff" : "#ffffff",
//         borderWidth: 1,
//       },
//     },
//   };

//   return (
//     <div className="flex justify-center items-center">
//       <div className="w-64 h-64 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 transition-all">
//         <Pie data={data} options={options} />
//       </div>
//     </div>
//   );
// }
