import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// Adjust the following import based on your project’s shadcn/ui select location
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AdvancedChartProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  chartDataByYear: { [year: string]: number[] };
}

export default function AdvancedChart({ selectedYear, onYearChange, chartDataByYear }: AdvancedChartProps) {
  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: `Monthly Sales for ${selectedYear}`,
        data: chartDataByYear[selectedYear],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `Monthly Sales Chart for ${selectedYear}` },
    },
  };

  return (
    <div>
      {/* Filter Section: Select Year */}
      <div style={{ marginBottom: '20px', maxWidth: '200px' }}>
        <Select value={selectedYear} onValueChange={(value: string) => onYearChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}