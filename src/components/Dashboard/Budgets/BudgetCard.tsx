import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import DropdownMenu from "@/ui/EditOrDeleteDropDownMenu";
import BudgetPopup from "@/ui/AddOrEditeBudgetPopup";
import DeleteConfirmation from "@/ui/DeleteBudgetConfirmationPopup";
import { useBudget } from "@/context/BudgetContext";
import { CategoryDropdownOptions } from "@/ui/CategoriesDropdown";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/slug";

interface Transaction {
  avatar: string;
  name: string;
  date: string;
  amount: number;
}

interface BudgetCardProps {
  category: CategoryDropdownOptions;
  maximum: number;
  spent: number;
  remaining: number;
  theme: string;
  latestTransactions: Transaction[];
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  category,
  maximum,
  spent,
  remaining,
  theme,
  latestTransactions,
}) => {
  const { editBudget } = useBudget();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Pour suivre la visibilité
  const progressBarRef = useRef<HTMLDivElement>(null); // Référence pour la barre de progression
  const router = useRouter();

  // Fonction pour voir si la barre de progression est visible dans le viewport
  useEffect(() => {
    const progressBarElement = progressBarRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // Déclenche l'animation lorsque l'élément est visible
            observer.unobserve(entry.target); // Désactiver l'observateur après animation
          }
        });
      },
      {
        threshold: 0.5, // Se déclenche quand 50% de la barre est visible
      }
    );

    if (progressBarElement) {
      observer.observe(progressBarElement);
    }

    return () => {
      if (progressBarElement) {
        observer.unobserve(progressBarElement);
      }
    };
  }, []);

  const handleSeeAll = () => {
    const slug = createSlug(category);
    router.push(`/dashboard/budgets/${slug}/`);
  };

  const handleEdit = () => {
    setIsEditPopupOpen(true);
  };

  const handleDelete = () => {
    setIsDeletePopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };

  const handleSubmit = (updatedBudget: {
    category: string;
    maximum: number;
    theme: string;
  }) => {
    editBudget(updatedBudget);
    closeEditPopup();
  };

  // Formater le montant avec un signe positif ou négatif
  const formatCurrency = (amount: number) => {
    const formattedAmount = Math.abs(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    return amount >= 0 ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  return (
    <div className="w-[608px] p-8 bg-white rounded-xl flex flex-col justify-start items-start gap-5">
      {/* Popup d'édition du budget */}
      <BudgetPopup
        isOpen={isEditPopupOpen}
        onClose={closeEditPopup}
        budgetToEdit={{ category, maximum, theme }}
        onSubmit={handleSubmit}
      />
      {/* Popup de confirmation de suppression */}
      <DeleteConfirmation
        isOpen={isDeletePopupOpen}
        onClose={closeDeletePopup}
        budgetCategory={category}
      />
      <div className="self-stretch flex justify-between items-center">
        <div className="h-6 justify-start items-center gap-4 flex">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: theme }}
          />
          <h2 className="text-grey-900 text-preset-2 font-bold">{category}</h2>
        </div>
        <DropdownMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          editLabel={"Edit Budget"}
          deleteLabel={"Delete Budget"}
        />
      </div>
      <div className="w-full h-32 flex-col justify-start items-start gap-4 flex">
        <div className="flex justify-start items-center gap-4">
          <p className="text-grey-500 text-preset-4">
            Maximum of ${maximum.toFixed(2)}
          </p>
        </div>
        <div
          className="w-full h-8 p-1 bg-beige-100 rounded flex justify-start items-start"
          ref={progressBarRef}
        >
          <div
            className={`self-stretch rounded transition-all duration-1000 ease-in-out ${
              isVisible ? "w-[100%]" : "w-0"
            }`}
            style={{
              width: isVisible ? `${(spent / maximum) * 100}%` : "0%", // Démarre à 0% et se termine à la taille nécessaire
              backgroundColor: theme,
            }}
          />
        </div>
        <div className="w-full flex items-center gap-4">
          <div className="grow shrink basis-0 h-[43px] justify-start items-center gap-4 flex">
            <div
              className="w-1 self-stretch"
              style={{ backgroundColor: theme }}
            />
            <div className="flex-col justify-center items-start gap-1 inline-flex">
              <p className="text-grey-500 text-preset-5">Spent</p>
              <p className="text-grey-900 text-preset-4 font-bold">
                ${spent.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="grow shrink basis-0 h-[43px] justify-start items-center gap-4 flex">
            <div className="w-1 self-stretch bg-beige-100 rounded-lg" />
            <div className="flex-col justify-center items-start gap-1 inline-flex">
              <p className="text-grey-500 text-preset-5">Remaining</p>
              <p className="text-grey-900 text-preset-4 font-bold">
                ${remaining.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-5 pt-6 bg-beige-100 rounded-xl flex flex-col justify-center items-start gap-5">
        <div className="self-stretch flex justify-between items-center">
          <h3 className="text-preset-2 text-grey-900 font-bold">
            Latest Spending
          </h3>
          <button
            type="button"
            className="flex items-center gap-x-3 text-preset-4 text-grey-500"
            onClick={handleSeeAll}
          >
            See All <CaretRightIcon />
          </button>
        </div>
        <ul className="self-stretch flex flex-col justify-start items-start divide-y divide-gray-200">
          {latestTransactions.map((transaction, index) => (
            <li
              key={index}
              className="w-full justify-start items-center gap-x-4 inline-flex py-2.5"
            >
              <div className="grow shrink basis-0 h-8 flex justify-start items-center gap-4">
                <Image
                  className="rounded-full"
                  src={transaction.avatar}
                  alt={`${transaction.name} avatar`}
                  width={32}
                  height={32}
                />
                <h4 className="text-grey-900 text-preset-5 font-bold">
                  {transaction.name}
                </h4>
              </div>
              <div className="flex flex-col justify-center items-end gap-1">
                <p className="text-right text-grey-900 text-xs font-bold">
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-grey-300 text-preset-5">
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
    </div>
  );
};
export default BudgetCard;
