import React, { createContext, useState, useContext, ReactNode } from "react";
import { Transaction } from "@/types";
import financialData from "@/data/financialData.json";

/**
 * Interface pour les valeurs fournies par le contexte des factures.
 * @property {Transaction[]} bills - Liste complète des transactions de factures.
 * @property {Transaction[]} paidBills - Liste des factures déjà payées.
 * @property {Transaction[]} upcomingBills - Liste des factures récurrentes à venir.
 * @property {Transaction[]} dueSoonBills - Liste des factures récurrentes dues dans les 7 prochains jours.
 * @property {string} searchQuery - La requête de recherche actuelle.
 * @property {function} setSearchQuery - Fonction pour mettre à jour la requête de recherche.
 * @property {string} sortBy - Le critère de tri actuel.
 * @property {function} setSortBy - Fonction pour mettre à jour le critère de tri.
 */
interface BillContextProps {
  bills: Transaction[];
  paidBills: Transaction[];
  upcomingBills: Transaction[];
  dueSoonBills: Transaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

// Création du contexte des factures avec une valeur par défaut undefined
const BillContext = createContext<BillContextProps | undefined>(undefined);

/**
 * Hook personnalisé pour accéder au contexte des factures.
 *
 * Ce hook permet à n'importe quel composant enfant d'accéder aux données du contexte des factures.
 * Si ce hook est utilisé en dehors d'un `BillProvider`, une erreur est levée.
 *
 * @throws {Error} - Si utilisé en dehors d'un `BillProvider`.
 * @returns {BillContextProps} - Le contexte des factures actuel.
 */
export const useBill = () => {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error("useBill must be used within a BillProvider");
  }
  return context;
};

/**
 * Composant BillProvider pour fournir le contexte des factures à l'application.
 *
 * Ce composant gère l'état des factures et permet de les filtrer, trier, et rechercher des factures spécifiques.
 * Il expose ces données et fonctions à tous les composants enfants via le contexte `BillContext`.
 *
 * @param {ReactNode} children - Les composants enfants qui peuvent accéder au contexte des factures.
 * @returns {JSX.Element} - Le provider de contexte des factures avec ses valeurs et méthodes.
 */
export const BillProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bills] = useState<Transaction[]>(financialData.transactions); // Initialisation des factures à partir du fichier JSON
  const [searchQuery, setSearchQuery] = useState<string>(""); // État pour la recherche
  const [sortBy, setSortBy] = useState<string>("Latest"); // État pour le critère de tri

  const today = new Date();

  // Filtre les factures déjà payées : Montant négatif et date dans le passé
  const paidBills = bills.filter(
    (bill) => bill.amount < 0 && new Date(bill.date) < today
  );

  // Filtre les factures récurrentes à venir : montant négatif et date dans le futur
  const upcomingBills = bills.filter(
    (bill) =>
      bill.recurring === true && bill.amount < 0 && new Date(bill.date) > today
  );

  // Filtre les factures dues bientôt : récurrentes, montant négatif, date dans les 7 prochains jours
  const dueSoonBills = bills.filter((bill) => {
    const billDate = new Date(bill.date);
    const timeDifference = billDate.getTime() - today.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return (
      bill.recurring === true &&
      bill.amount < 0 &&
      daysDifference >= 0 &&
      daysDifference <= 7
    );
  });

  // Filtre les factures par la recherche
  const filteredBills = bills.filter((bill) =>
    bill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Applique le tri aux factures filtrées
  const sortedBills = filteredBills.sort((a, b) => {
    switch (sortBy) {
      case "Latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "Oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "A to Z":
        return a.name.localeCompare(b.name);
      case "Z to A":
        return b.name.localeCompare(a.name);
      case "Highest":
        return b.amount - a.amount;
      case "Lowest":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return (
    <BillContext.Provider
      value={{
        bills: sortedBills,
        paidBills,
        upcomingBills,
        dueSoonBills,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
