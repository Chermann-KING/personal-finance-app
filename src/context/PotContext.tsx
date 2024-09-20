import React, { createContext, useState, useContext, ReactNode } from "react";
import { Pot } from "@/types";
import financialData from "@/data/financialData.json";

// Interface du contexte
interface PotContextProps {
  pots: Pot[];
  addPot: (newPot: Pot) => void;
  editPot: (updatedPot: Pot) => void;
  deletePot: (potName: string) => void;
  addMoneyToPot: (potName: string, amount: number) => void;
  withdrawFromPot: (potName: string, amount: number) => void;
}

// Créer le contexte
export const PotContext = createContext<PotContextProps | undefined>(undefined);

// Hook pour utiliser le contexte facilement
export const usePot = () => {
  const context = useContext(PotContext);
  if (!context) {
    throw new Error("usePot must be used within a PotProvider");
  }
  return context;
};

// Provider du contexte
export const PotProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pots, setPots] = useState<Pot[]>(financialData.pots);

  const addPot = (newPot: Pot) => {
    setPots((prevPots) => [...prevPots, newPot]);
  };

  const editPot = (updatedPot: Pot) => {
    setPots((prevPots) =>
      prevPots.map((pot) => (pot.name === updatedPot.name ? updatedPot : pot))
    );
  };

  const deletePot = (potName: string) => {
    setPots((prevPots) => prevPots.filter((pot) => pot.name !== potName));
  };

  const addMoneyToPot = (potName: string, amount: number) => {
    setPots((prevPots) =>
      prevPots.map((pot) =>
        pot.name === potName ? { ...pot, total: pot.total + amount } : pot
      )
    );
  };

  const withdrawFromPot = (potName: string, amount: number) => {
    setPots((prevPots) =>
      prevPots.map((pot) =>
        pot.name === potName ? { ...pot, total: pot.total - amount } : pot
      )
    );
  };

  return (
    <PotContext.Provider
      value={{
        pots,
        addPot,
        editPot,
        deletePot,
        addMoneyToPot,
        withdrawFromPot,
      }}
    >
      {children}
    </PotContext.Provider>
  );
};
