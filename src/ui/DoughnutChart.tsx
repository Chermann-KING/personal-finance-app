import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: ChartData<"doughnut", number[], string>;
  spent: number;
  limit: number;
  options?: ChartOptions<"doughnut">;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  spent,
  limit,
  options,
}) => {
  // Options par défaut
  const defaultOptions: ChartOptions<"doughnut"> = {
    cutout: "80%", // Espace vide au centre
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw as number;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
  };
  const defaultOptions2: ChartOptions<"doughnut"> = {
    cutout: "70%", // Espace vide au centre
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw as number;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="mx-auto relative w-[247px]">
      {/* chart */}
      <div className="relative">
        <Doughnut
          data={data}
          options={options || defaultOptions}
          style={{
            zIndex: "9",
          }}
        />
        <Doughnut
          data={data}
          options={options || defaultOptions2}
          style={{
            opacity: "0.7",
            position: "absolute",
            top: "0",
            right: "0",
          }}
        />
      </div>
      {/* center values */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-preset-1 text-grey-900 font-bold">
          ${Math.trunc(spent)}
        </p>
        <p className="text-preset-4 text-grey-500">
          of ${Math.trunc(limit)} limit
        </p>
      </div>
    </div>
  );
};

export default DoughnutChart;
