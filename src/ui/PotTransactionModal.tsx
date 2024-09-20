import React, { useState } from "react";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import Button from "@/ui/Button";
import InputField from "@/ui/InputField";
import { Pot } from "@/types";

interface PotTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pot: Pot;
  onSubmit: (amount: number) => void; // callback pour ajouter ou retirer de l'argent
  actionType: "add" | "withdraw"; // pour déterminer si on ajoute ou retire de l'argent
}

const PotTransactionModal: React.FC<PotTransactionModalProps> = ({
  isOpen,
  onClose,
  pot,
  onSubmit,
  actionType,
}) => {
  const [amount, setAmount] = useState<number | "">("");

  if (!isOpen) return null;

  const newTotal =
    actionType === "add"
      ? pot.total + (amount ? Number(amount) : 0)
      : pot.total - (amount ? Number(amount) : 0);

  const handleSubmit = () => {
    if (amount !== "") {
      onSubmit(Number(amount));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50">
      <div className="bg-white flex flex-col gap-y-5 rounded-lg p-8 w-[560px]">
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {actionType === "add"
              ? `Add to '${pot.name}'`
              : `Withdraw from '${pot.name}'`}
          </h2>
          <CloseModalIcon
            className="text-grey-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Info bar */}
        <p className="text-preset-4 text-grey-500">
          {actionType === "add"
            ? "Add funds to this savings pot to reach your goals faster. Every contribution brings you closer to your target."
            : "Withdraw funds from this savings pot. Be sure to keep enough to meet your future goals."}
        </p>

        {/* Progression bar */}
        <div className="flex flex-col gap-y-4">
          {/* New Amount Display */}
          <div className="flex justify-between items-center">
            <p className="text-preset-4 text-grey-500">New Amount</p>
            <p className="text-preset-1 text-grey-900 font-bold">
              ${newTotal.toFixed(2)}
            </p>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-beige-100 rounded flex justify-start items-start">
            <div
              className="self-stretch rounded"
              style={{
                width: `${(newTotal / pot.target) * 100}%`,
                backgroundColor: pot.theme,
              }}
            />
          </div>
          {/* Progress Percentage */}
          <div className="flex justify-between items-center">
            <p className="text-preset-5" style={{ color: pot.theme }}>
              {((newTotal / pot.target) * 100).toFixed(2)}%
            </p>
            <p className="text-preset-5 text-grey-500">
              Target of ${pot.target}
            </p>
          </div>
        </div>

        {/* Input Field */}
        <InputField
          label={actionType === "add" ? "Amount to Add" : "Amount to Withdraw"}
          name="amount"
          type="number"
          placeholder="e.g. 200"
          prefix="$"
          value={amount.toString()}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {/* Action Button */}
        <Button onClick={handleSubmit} className="w-full" variant="primary">
          {actionType === "add" ? "Confirm Addition" : "Confirm Withdrawal"}
        </Button>
      </div>
    </div>
  );
};

export default PotTransactionModal;
