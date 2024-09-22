import React from "react";
import RecurringBillsIcon from "@/assets/images/icon-bills-recurring-bills.svg";
import { useBill } from "@/context/BillContext";

// Formater le montant
const formatCurrency = (amount: number) => {
  const formattedAmount = Math.abs(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formattedAmount;
};

const TotalBills = () => {
  const { bills } = useBill();

  // Calculez la somme totale des factures
  const totalBills = bills.reduce(
    (acc, bill) => acc + Math.abs(bill.amount),
    0
  );
  return (
    <div className="bg-grey-900 w-full flex flex-col justify-start gap-y-8 p-6 rounded-xl">
      <RecurringBillsIcon />
      {/* total amount */}
      <div>
        <h4 className="text-preset-4 text-white mb-2">Total Bills</h4>
        <p className="text-preset-1 text-white">{formatCurrency(totalBills)}</p>
      </div>
    </div>
  );
};

export default TotalBills;
