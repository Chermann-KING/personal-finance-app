import React, { FC } from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import { Transaction } from "@/types";

interface TransactionsOverviewProps {
  transactions: Transaction[];
}

const TransactionsOverview: FC<TransactionsOverviewProps> = ({
  transactions,
}) => {
  const router = useRouter();

  const handleSeeDetails = () => {
    router.push("/dashboard/transactions");
  };

  return (
    <div className="self-stretch flex flex-col gap-y-7 bg-white rounded-xl px-5 pt-6 pb-1 sm:pt-8 ">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-preset-2 text-grey-900 font-bold">Transactions</h2>
        <button
          type="button"
          className="flex items-center gap-x-3 text-preset-4 text-grey-500"
          onClick={handleSeeDetails}
        >
          View All <CaretRightIcon />
        </button>
      </div>

      {/* contents */}
      <ul className="divide-y divide-solid divide-grey-100">
        {transactions.map((transaction, index) => (
          <li key={index} className="flex justify-between items-center py-5">
            {/* avatar & name */}
            <div className="flex items-center gap-x-4">
              <Image
                src={transaction.avatar}
                alt={`${transaction.name} avatar`}
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="text-preset-4 text-grey-900 font-bold">
                {transaction.name}
              </p>
            </div>
            {/* transaction & date */}
            <div className=" flex flex-col justify-center gap-y-2 text-right">
              <p
                className={`text-preset-4 font-bold ${
                  transaction.amount < 0 ? "text-grey-900" : "text-green"
                }`}
              >
                {formatCurrency(transaction.amount, true)}
              </p>
              <p className="text-preset-5 text-grey-500">
                {new Date(transaction.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsOverview;
