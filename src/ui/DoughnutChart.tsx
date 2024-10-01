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

// Enregistrement des éléments requis pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Props pour le composant DoughnutChart.
 * @property {ChartData<"doughnut", number[], string>} data - Les données pour le graphique en anneau (Doughnut).
 * @property {number} spent - Montant déjà dépensé, affiché au centre du graphique.
 * @property {number} limit - Limite de dépenses, affichée au centre du graphique sous le montant dépensé.
 * @property {ChartOptions<"doughnut">} [options] - Options personnalisées pour le graphique. Les options par défaut sont utilisées si aucune option n'est passée.
 */
interface DoughnutChartProps {
  data: ChartData<"doughnut", number[], string>;
  spent: number;
  limit: number;
  options?: ChartOptions<"doughnut">;
}

/**
 * Composant DoughnutChart pour afficher un graphique en anneau (doughnut) avec des données de dépenses.
 *
 * Ce composant affiche deux graphiques Doughnut superposés, l'un servant de fond transparent et l'autre
 * affichant les données réelles. Au centre du graphique, on trouve un texte indiquant le montant dépensé
 * (`spent`) et la limite de dépenses (`limit`).
 *
 * @param {DoughnutChartProps} props - Les props nécessaires pour configurer le DoughnutChart.
 * @returns JSX.Element
 */
const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  spent,
  limit,
  options,
}) => {
  // Options par défaut pour le graphique principal
  const defaultOptions: ChartOptions<"doughnut"> = {
    cutout: "80%", // Espace vide au centre
    plugins: {
      legend: {
        display: false, // Désactive la légende
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw as number;
            return `$${value.toFixed(2)}`; // Formate les valeurs en dollars
          },
        },
      },
    },
  };

  // Options pour le graphique d'arrière-plan (plus opaque et sans tooltips)
  const backgroundChartOptions: ChartOptions<"doughnut"> = {
    cutout: "70%", // Espace vide légèrement différent au centre
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Désactive le tooltip sur le fond
      },
    },
  };

  return (
    <div className="mx-auto relative w-[247px]">
      {/* Chart principal */}
      <div className="relative">
        <Doughnut
          key="foreground-chart"
          data={data}
          options={options || defaultOptions}
          style={{ zIndex: "9" }}
        />
        {/* Chart d'arrière-plan */}
        <Doughnut
          key="background-chart"
          data={data}
          options={backgroundChartOptions}
          style={{
            opacity: "0.7",
            position: "absolute",
            top: "0",
            right: "0",
            left: "0",
            bottom: "0",
            zIndex: "1",
          }}
        />
      </div>

      {/* Valeurs affichées au centre du graphique */}
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
