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

  // Récupération des données pour le graphique : dépenses réelles et limite totale
  const spent = budgets.reduce((acc, budget) => acc + budget.spent, 0);
  const limit = budgets.reduce((acc, budget) => acc + budget.maximum, 0);

  // Typage des données du graphique : dépenses réelles
  const data: ChartData<"doughnut", number[], string> = {
    labels: budgets.map((budget) => budget.category),
    datasets: [
      {
        data: budgets.map((budget) => budget.spent), // Affiche les dépenses réelles
        backgroundColor: budgets.map((budget) => budget.theme),
        hoverOffset: 4,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="md:w-[428px] self-stretch flex flex-col justify-start sm:gap-y-5 gap-y-5 bg-white rounded-xl sm:p-8 px-5 py-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-preset-2 text-grey-900 font-bold">Budgets</h2>
        <button
          type="button"
          className="flex items-center gap-x-3 text-preset-4 text-grey-500"
          onClick={handleSeeDetails}
        >
          See Details <CaretRightIcon />
        </button>
      </div>

      {/* Budget Chart */}
      <div className="flex flex-col justify-between items-center sm:flex-row sm:gap-x-4 gap-y-4 pb-3">
        {/* Doughnut Chart avec les dépenses réelles */}
        <DoughnutChart data={data} spent={spent} limit={limit} />

        {/* Budget Details : affiche les maximums des budgets */}
        <div className="self-stretch grid sm:grid-cols-1 grid-cols-2 gap-y-4">
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
