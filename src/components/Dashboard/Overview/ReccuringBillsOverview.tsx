import React, { FC } from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import { useRouter } from "next/navigation";
// import { Bill } from "@/types";

interface ReccuringBillsOverviewProps {
  paid?: number;
  upcoming?: number;
  dueSoon?: number;
}

const ReccuringBillsOverview: FC<ReccuringBillsOverviewProps> = ({
  paid = 0,
  upcoming = 0,
  dueSoon = 0,
}) => {
  const router = useRouter();

  const handleSeeDetails = () => {
    router.push("/dashboard/recuring-bills");
  };

  return (
    <div className="self-stretch flex flex-col justify-between gap-y-8 bg-white rounded-xl px-5 py-6 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-preset-2 text-grey-900 font-bold">
          Recurring Bills
        </h2>
        <button
          className="flex items-center gap-x-3 text-preset-4 text-grey-500"
          onClick={handleSeeDetails}
        >
          See Details <CaretRightIcon />
        </button>
      </div>

      {/* Bills */}
      <div className="flex flex-col gap-3">
        {/* Paid Bills */}
        <div className="relative h-[60px] flex justify-between items-center bg-green rounded-lg">
          <div className="absolute w-full h-full top-0 left-[4px] flex justify-between items-center bg-beige-100 py-3 px-5 rounded-[8px]">
            <p className="text-preset-4 text-grey-500">Paid Bills</p>
            <p className="text-preset-4 font-bold text-grey-900">
              ${paid.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Total Upcoming */}
        <div className="relative h-[60px] flex justify-between items-center bg-yellow  rounded-lg">
          <div className="absolute  w-full h-full top-0 left-[4px] flex justify-between items-center bg-beige-100 py-3 px-5 rounded-[8px]">
            <p className="text-preset-4 text-grey-500">Total Upcoming</p>
            <p className="text-preset-4 font-bold text-grey-900">
              ${upcoming.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Due Soon */}
        <div className="relative h-[60px] flex justify-between items-center bg-cyan  rounded-lg">
          <div className="absolute  w-full h-full top-0 left-[4px] flex justify-between items-center bg-beige-100 py-3 px-5 rounded-[8px]">
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
