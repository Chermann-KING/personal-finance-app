import React from "react";
import Image from "next/image";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  if (!transaction) return null;

  return (
    <li className="self-stretch py-4 grid grid-cols-2 gap-x-8">
      {/* avatar, recipent/sender, category */}
      <div className="min-w-[191px] max-w-[657px] grow shrink basis-0 h-auto justify-start items-center  gap-x-3 sm:gap-x-4 flex">
        <Image
          src={transaction.avatar}
          alt={`${transaction.name} avatar`}
          width={40}
          height={40}
          className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full"
        />
        <div className="h-full w-full min-w-[136px] flex flex-col sm:flex-row justify-between sm:items-center gap-x-0 sm:gap-x-8">
          <p className="w-[136px] sm:w-[220px]  sm:flex-grow-0 overflow-hidden sm:overflow-visible sm:whitespace-normal text-ellipsis whitespace-nowrap text-preset-4 text-grey-900 font-bold text-nowrap">
            {transaction.name}
          </p>
          <p className="w-full sm:w-[120px] text-preset-5 text-grey-500 text-left">
            {transaction.category}
          </p>
        </div>
      </div>

      {/* date & amount*/}
      <div className="sm:flex-row flex-col-reverse justify-between items-center gap-0 sm:gap-x-8 inline-flex">
        <p className="w-full sm:w-[120px] sm:text-left text-right text-preset-5 text-grey-500">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
        <p
          className={`w-full sm:w-[200px] text-preset-4 font-bold text-right ${
            transaction.amount < 0 ? "text-grey-900" : "text-green"
          }`}
        >
          {formatCurrency(transaction.amount, true)}
        </p>
      </div>
    </li>
  );
};

export default TransactionItem;
