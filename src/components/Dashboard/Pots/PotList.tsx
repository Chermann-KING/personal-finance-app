import React, { useState, useEffect, useRef } from "react";
import { usePot } from "@/context/PotContext";
import { Pot } from "@/types";
import Button from "@/ui/Button";
import DropdownMenu from "@/ui/EditOrDeleteDropDownMenu";
import DeleteConfirmation from "@/ui/DeleteConfirmationPopup";

interface PotListProps {
  onEditPot: (pot: Pot) => void;
  onDeletePot: (pot: Pot) => void;
  onAddMoney: (pot: Pot) => void;
  onWithdraw: (pot: Pot) => void;
}

const PotList = ({ onEditPot }: PotListProps) => {
  const { pots, deletePot } = usePot();

  const [isVisible, setIsVisible] = useState(false); // Pour suivre la visibilité
  const progressBarRef = useRef<HTMLDivElement>(null); // Référence pour la barre de progression
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [potToDelete, setPotToDelete] = useState<Pot | null>(null);

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

  const handleDeletePot = (pot: Pot) => {
    setPotToDelete(pot); // Définir le pot à supprimer
    setIsDeletePopupOpen(true); // Ouvrir la popup de confirmation
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false); // Fermer la popup
  };

  const confirmDeletePot = () => {
    if (potToDelete) {
      deletePot(potToDelete.name); // Supprimer le pot
      closeDeletePopup();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {pots.map((pot, index) => (
        <div
          key={index}
          className="bg-white w-[518px] h-[303px] flex flex-col gap-y-8 rounded-xl p-6"
        >
          {/* Popup de confirmation de suppression */}
          <DeleteConfirmation
            isOpen={isDeletePopupOpen}
            onClose={closeDeletePopup}
            itemType="pot"
            itemName={potToDelete ? potToDelete.name : ""}
            onConfirm={confirmDeletePot}
          />

          {/* header */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: pot.theme }}
              />
              <h3 className="text-preset-2 text-grey-900 font-bold">
                {pot.name}
              </h3>
            </div>
            <DropdownMenu
              onEdit={() => onEditPot(pot)}
              onDelete={() => handleDeletePot(pot)}
              editLabel={"Edit Pot"}
              deleteLabel={"Delete Pot"}
            />
          </div>
          {/* saved, progressbar & target */}
          <div className="flex flex-col gap-y-4">
            {/* saved */}
            <div className="flex justify-between items-center">
              <p className="text-preset-4 text-grey-500">Total Saved</p>
              <p className="text-preset-1 text-grey-900 font-bold">
                ${pot.total.toFixed(2)}
              </p>
            </div>
            {/* barre de progression */}
            <div
              className="w-full h-2 p-0 bg-beige-100 rounded flex justify-start items-start"
              ref={progressBarRef}
            >
              <div
                className={`self-stretch rounded transition-all duration-1000 ease-in-out ${
                  isVisible ? "w-[100%]" : "w-0"
                }`}
                style={{
                  width: isVisible
                    ? `${(pot.total / pot.target) * 100}%`
                    : "0%",
                  backgroundColor: pot.theme,
                }}
              />
            </div>
            {/* target */}
            <div className="flex justify-between items-center">
              <p className="text-preset-5 text-grey-500 font-bold">
                {((pot.total / pot.target) * 100).toFixed(1)}%
              </p>
              <p className="text-preset-5 text-grey-500">
                Target of ${pot.target}
              </p>
            </div>
          </div>
          {/* actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {}}
            >
              + Add Money
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {}}
            >
              Withdraw
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PotList;
