import React, { useEffect, useState } from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import { useRouter } from "next/navigation";

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

  const [spent, setSpent] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);

  const handleSeeDetails = () => {
    router.push("/dashboard/budgets");
  };

  useEffect(() => {
    const totalSpent = budgets.reduce((acc, budget) => acc + budget.spent, 0);
    const totalLimit = budgets.reduce((acc, budget) => acc + budget.maximum, 0);

    setSpent(totalSpent);
    setLimit(totalLimit);
  }, [budgets]);

  const calculateSegment = (spent: number, maximum: number) => {
    return (spent / limit) * 100;
  };

  return (
    <div className="w-[428px] h-[410px] flex flex-col justify-start gap-y-8 bg-white rounded-lg p-8">
      {/* header */}
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
      <div className="mt-5 flex justify-between items-center">
        {/* Doughnut Chart */}
        <div className="relative w-[247px] h-[247px] flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            {budgets.map((budget, index) => {
              const startOffset =
                budgets
                  .slice(0, index)
                  .reduce(
                    (acc, b) => acc + calculateSegment(b.spent, b.maximum),
                    0
                  ) || 0;
              const dashArray = calculateSegment(budget.spent, budget.maximum);

              return (
                <circle
                  key={index}
                  r="15.915"
                  cx="18"
                  cy="18"
                  fill="transparent"
                  stroke={budget.theme}
                  strokeWidth="2.5"
                  strokeDasharray={`${dashArray} ${100 - dashArray}`}
                  strokeDashoffset={-startOffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-preset-1 text-grey-900">${spent.toFixed(2)}</p>
            <p className="text-preset-4 text-grey-500">
              of ${limit.toFixed(2)} limit
            </p>
          </div>
        </div>

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
