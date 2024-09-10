import React from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import { useRouter } from "next/navigation";

interface ReccuringBillsOverviewProps {
  paid?: number;
  upcoming?: number;
  dueSoon?: number;
}

const ReccuringBillsOverview: React.FC<ReccuringBillsOverviewProps> = ({
  paid = 0,
  upcoming = 0,
  dueSoon = 0,
}) => {
  const router = useRouter();

  const handleSeeDetails = () => {
    router.push("/dashboard/bills");
  };

  return (
    <div className="w-[428px] h-[327px] flex flex-col justify-between bg-white rounded-lg p-8 shadow">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-preset-2 text-grey-900">Recurring Bills</h2>
        <button
          className="flex items-center gap-x-3 text-preset-4 text-grey-500"
          onClick={handleSeeDetails}
        >
          See Details <CaretRightIcon />
        </button>
      </div>

      {/* Bills */}
      <div className="flex flex-col gap-4">
        {/* Paid Bills */}
        <div className="relative h-[60px] flex justify-between items-center bg-green  rounded-lg">
          <div className="absolute  w-[360.5px] h-full top-0 left-[4px] flex justify-between items-center bg-beige-100 py-4 px-5 rounded-[8px]">
            <p className="text-preset-4 text-grey-500">Paid Bills</p>
            <p className="text-preset-4 font-bold text-grey-900">
              ${paid.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Total Upcoming */}
        <div className="relative h-[60px] flex justify-between items-center bg-yellow  rounded-lg">
          <div className="absolute  w-[360.5px] h-full top-0 left-[4px] flex justify-between items-center bg-beige-100 py-4 px-5 rounded-[8px]">
            <p className="text-preset-4 text-grey-500">Total Upcoming</p>
            <p className="text-preset-4 font-bold text-grey-900">
              ${upcoming.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Due Soon */}
        <div className="relative h-[60px] flex justify-between items-center bg-cyan  rounded-lg">
          <div className="absolute  w-[360.5px] h-full top-0 left-[4px] flex justify-between items-center bg-beige-100 py-4 px-5 rounded-[8px]">
            <p className="text-preset-4 text-grey-500">Due Soon</p>
            <p className="text-preset-4 font-bold text-grey-900">
              ${dueSoon.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReccuringBillsOverview;
