import React, { createContext, useState, useContext, ReactNode } from "react";
import { Pot } from "@/types";
import financialData from "@/data/financialData.json";

/**
 * Interface pour les valeurs fournies par le contexte des pots.
 * @property {Pot[]} pots - Liste des pots d'épargne.
 * @property {function} addPot - Fonction pour ajouter un nouveau pot.
 * @property {function} editPot - Fonction pour modifier un pot existant.
 * @property {function} deletePot - Fonction pour supprimer un pot par son nom.
 * @property {function} addMoneyToPot - Fonction pour ajouter de l'argent à un pot.
 * @property {function} withdrawFromPot - Fonction pour retirer de l'argent d'un pot.
 */
interface PotContextProps {
  pots: Pot[];
  addPot: (newPot: Pot) => void;
  editPot: (updatedPot: Pot) => void;
  deletePot: (potName: string) => void;
  addMoneyToPot: (potName: string, amount: number) => void;
  withdrawFromPot: (potName: string, amount: number) => void;
}

// Création du contexte des pots avec une valeur par défaut undefined
export const PotContext = createContext<PotContextProps | undefined>(undefined);

/**
 * Hook personnalisé pour accéder au contexte des pots.
 *
 * Ce hook permet à n'importe quel composant d'accéder aux données et aux fonctions du contexte des pots.
 * Si ce hook est utilisé en dehors d'un `PotProvider`, une erreur est levée.
 *
 * @throws {Error} - Si utilisé en dehors d'un `PotProvider`.
 * @returns {PotContextProps} - Le contexte des pots actuel.
 */
export const usePot = () => {
  const context = useContext(PotContext);
  if (!context) {
    throw new Error("usePot must be used within a PotProvider");
  }
  return context;
};

/**
 * Composant PotProvider pour fournir le contexte des pots à l'application.
 *
 * Ce composant gère l'état des pots d'épargne et permet d'ajouter, modifier, supprimer des pots, ainsi que d'ajouter ou retirer de l'argent dans les pots.
 * Il expose ces données et fonctions à tous les composants enfants via le contexte `PotContext`.
 *
 * @param {ReactNode} children - Les composants enfants qui peuvent accéder au contexte des pots.
 * @returns {JSX.Element} - Le provider de contexte des pots avec ses valeurs et méthodes.
 */
export const PotProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pots, setPots] = useState<Pot[]>(financialData.pots); // Initialisation des pots à partir des données

  /**
   * Fonction pour ajouter un nouveau pot.
   *
   * @param {Pot} newPot - Le nouveau pot à ajouter.
   */
  const addPot = (newPot: Pot) => {
    setPots((prevPots) => [...prevPots, newPot]);
  };

  /**
   * Fonction pour modifier un pot existant.
   *
   * @param {Pot} updatedPot - Le pot avec les nouvelles données à mettre à jour.
   */
  const editPot = (updatedPot: Pot) => {
    setPots((prevPots) =>
      prevPots.map((pot) => (pot.name === updatedPot.name ? updatedPot : pot))
    );
  };

  /**
   * Fonction pour supprimer un pot par son nom.
   *
   * @param {string} potName - Le nom du pot à supprimer.
   */
  const deletePot = (potName: string) => {
    setPots((prevPots) => prevPots.filter((pot) => pot.name !== potName));
  };

  /**
   * Fonction pour ajouter de l'argent à un pot.
   *
   * @param {string} potName - Le nom du pot auquel ajouter de l'argent.
   * @param {number} amount - Le montant à ajouter au pot.
   */
  const addMoneyToPot = (potName: string, amount: number) => {
    setPots((prevPots) =>
      prevPots.map((pot) =>
        pot.name === potName ? { ...pot, total: pot.total + amount } : pot
      )
    );
  };

  /**
   * Fonction pour retirer de l'argent d'un pot.
   *
   * @param {string} potName - Le nom du pot dans lequel retirer de l'argent.
   * @param {number} amount - Le montant à retirer du pot.
   */
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
