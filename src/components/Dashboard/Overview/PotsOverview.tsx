import React from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import PotIcon from "@/assets/images/icon-pot.svg";
import { useRouter } from "next/navigation";
import { Pot } from "@/types";
interface PotsOverviewProps {
  pots: Pot[];
}

const PotsOverview: React.FC<PotsOverviewProps> = ({ pots }) => {
  const router = useRouter();

  // Calcule le total de toutes les économies
  const totalSaved = pots.reduce((sum, pot) => sum + pot.total, 0);

  // Limite l'affichage à 4 pots
  const displayedPots = pots.slice(0, 4);

  const handleSeeDetails = () => {
    router.push("/dashboard/pots");
  };

  return (
    <div className="bg-white self-stretch flex flex-col justify-between items-start gap-y-5 px-5 py-6 rounded-xl">
      {/* header */}
      <div className="self-stretch flex justify-between items-center">
        <h2 className="text-preset-2 text-grey-900 font-bold">Pots</h2>
        <button
          type="button"
          className="flex items-center gap-x-3 text-preset-4 text-grey-500"
          onClick={handleSeeDetails}
        >
          See Details <CaretRightIcon />
        </button>
      </div>

      {/* contents */}
      <div className="self-stretch flex flex-col justify-between items-start sm:flex-row sm:gap-x-5 gap-y-5">
        {/* Total Saved */}
        <div className="self-stretch sm:w-full flex items-center gap-x-4 bg-beige-100 p-4 rounded-xl">
          <PotIcon className={"text-green"} />
          <div className="flex flex-col gap-y-3">
            <span className="text-preset-4 text-grey-500">Total Saved</span>
            <span className="text-preset-1 text-grey-900 font-bold">
              ${Math.trunc(totalSaved)}
            </span>
          </div>
        </div>

        {/* Pots */}
        <div className="min-w-[303px] grid grid-cols-2 grid-rows-2 gap-x-12 gap-y-4">
          {displayedPots.map((pot) => (
            <div
              key={pot.name}
              className="flex items-center w-[103.5px] h-[43px]"
            >
              {/* Theme du pot */}
              <div
                className={`h-[43px] w-[5px] rounded-full`}
                style={{ backgroundColor: pot.theme }}
              ></div>
              {/* Infos du pot */}
              <div className="pl-3">
                <p className="text-preset-5 text-grey-500">{pot.name}</p>
                <p className="text-preset-4 font-bold text-grey-900">
                  ${Math.trunc(pot.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PotsOverview;
