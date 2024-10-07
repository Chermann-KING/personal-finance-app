import React, { useEffect, useState } from "react";
import DoughnutChart from "@/ui/DoughnutChart";
import { Budget } from "@/types";
import axios from "axios";

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour récupérer les budgets depuis l'API
  const fetchBudgets = async () => {
    try {
      const response = await axios.get("/api/budgets");
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets(); // Récupère les budgets lors du montage du composant
  }, []);

  // Afficher un indicateur de chargement pendant la récupération des données
  if (loading) {
    return <p>Loading...</p>;
  }

  // Calcul des dépenses et des limites
  const spent = budgets.reduce((acc, budget) => acc + (budget.spent ?? 0), 0);
  const limit = budgets.reduce((acc, budget) => acc + budget.maximum, 0);

  // Préparation des données pour le Doughnut
  const doughnutData = {
    labels: budgets.map((budget) => budget.category),
    datasets: [
      {
        data: budgets.map((budget) => budget.spent ?? 0),
        backgroundColor: budgets.map((budget) => budget.theme),
        hoverOffset: 4,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="self-stretch h-[599px] flex flex-col justify-evenly gap-y-8 bg-white rounded-lg p-8 py-3">
      {/* Doughnut Chart */}
      <DoughnutChart data={doughnutData} spent={spent} limit={limit} />

      <div className="w-full">
        <h2 className="text-preset-2 text-grey-900 font-bold mb-2">
          Spending Summary
        </h2>

        {/* Budget Details */}
        <ul className="grid grid-cols-1 divide-y divide-grey-100">
          {budgets.map((budget, index) => (
            <li key={index} className="flex items-center py-3">
              {/* Budget Theme */}
              <div
                className={`h-[21px] w-1 rounded-full`}
                style={{ backgroundColor: budget.theme }}
              ></div>

              {/* Budget Info */}
              <div className="pl-4 w-full flex justify-between items-center">
                <p className="text-preset-4 text-grey-500">{budget.category}</p>
                <div className="flex items-center gap-x-2">
                  <p className="text-preset-3 font-bold text-grey-900">
                    ${budget.spent?.toFixed(2) ?? "0.00"}
                  </p>
                  <p className="text-preset-5 text-grey-500">
                    of ${budget.maximum.toFixed(2)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Budgets;
