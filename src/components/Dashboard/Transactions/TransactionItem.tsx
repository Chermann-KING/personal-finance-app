import React from "react";
import Image from "next/image";
import { Transaction } from "@/types";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  // Formater le montant avec un signe positif ou négatif
  const formatCurrency = (amount: number) => {
    const formattedAmount = Math.abs(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    return amount >= 0 ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  // console.log("Transaction item:", transaction);
  if (!transaction) return null;

  return (
    <li className="self-stretch px-4 py-4 flex justify-start items-center gap-8">
      {/* recipent/sender */}
      <div className="grow shrink basis-0 h-10 justify-start items-center gap-4 flex">
        <Image
          src={transaction.avatar}
          alt={`${transaction.name} avatar`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-col justify-center items-start gap-2 inline-flex">
          <p className="text-preset-4 text-grey-900 font-bold">
            {transaction.name}
          </p>
        </div>
      </div>

      {/* category */}
      <div className="w-[120px] flex-col justify-center items-start gap-1.5 inline-flex">
        <p className="text-preset-5 text-grey-500">{transaction.category}</p>
      </div>

      {/* transaction date */}
      <div className="w-[120px] flex-col justify-start items-start gap-2 inline-flex">
        <p className="text-preset-5 text-grey-500">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>

      {/* amount */}
      <div className="w-[200px] flex-col justify-center items-end gap-2 inline-flex">
        <p
          className={`text-preset-4 font-bold ${
            transaction.amount < 0 ? "text-grey-900" : "text-green"
          }`}
        >
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </li>
  );
};

export default TransactionItem;
