import React from "react";
import { ChartData } from "chart.js";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import { useRouter } from "next/navigation";
import DoughnutChart from "@/ui/DoughnutChart";
interface Budget {
  category: string;
  maximum: number;
  spent: number;
  theme: string;
}

interface BudgetOverviewProps {
  budgets: Budget[];
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets }) => {
  const router = useRouter();

  const handleSeeDetails = () => {
    router.push("/dashboard/budgets");
  };

  // Récupération des données pour le graphique
  const spent = budgets.reduce((acc, budget) => acc + budget.spent, 0);
  const limit = budgets.reduce((acc, budget) => acc + budget.maximum, 0);

  // Typage des données du graphique
  const data: ChartData<"doughnut", number[], string> = {
    labels: budgets.map((budget) => budget.category),
    datasets: [
      {
        data: budgets.map((budget) => budget.spent),
        backgroundColor: budgets.map((budget) => budget.theme),
        hoverOffset: 4,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-[428px] h-[410px] flex flex-col justify-start gap-y-8 bg-white rounded-lg p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-preset-2 text-grey-900">Budgets</h2>
        <button
          type="button"
          className="flex items-center gap-x-3 text-preset-4 text-grey-500"
          onClick={handleSeeDetails}
        >
          See Details <CaretRightIcon />
        </button>
      </div>

      {/* Budget Chart */}
      <div className="mt-5 flex justify-between items-center gap-x-3">
        {/* Doughnut */}
        <DoughnutChart data={data} spent={spent} limit={limit} />

        {/* Budget Details */}
        <div className="h-[220px] grid grid-cols-1 gap-y-4">
          {budgets.map((budget, index) => (
            <div
              key={index}
              className="flex items-center w-[103.5px] h-[43px] gap-y-4"
            >
              {/* Budget Theme */}
              <div
                className={`h-[43px] w-[5px] rounded-full`}
                style={{ backgroundColor: budget.theme }}
              ></div>

              {/* Budget Info */}
              <div className="pl-4 flex flex-col justify-between h-[43px]">
                <p className="text-preset-5 text-grey-500">{budget.category}</p>
                <p className="text-preset-4 font-bold text-grey-900">
                  ${budget.maximum.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
