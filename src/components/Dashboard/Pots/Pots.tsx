import React, { useState, useEffect } from "react";
import { usePot } from "@/context/PotContext";
import { Pot } from "@/types";
import Button from "@/ui/Button";
import DropdownMenu from "@/ui/EditOrDeleteDropDownMenu";
import DeleteConfirmation from "@/ui/DeleteConfirmationPopup";

/**
 * Interface pour les props du composant PotList.
 * @property {function} onEditPot - Fonction appelée lorsque l'utilisateur clique pour éditer un pot.
 * @property {function} onDeletePot - Fonction appelée lorsque l'utilisateur clique pour supprimer un pot.
 * @property {function} onAddMoney - Fonction appelée lorsque l'utilisateur ajoute de l'argent à un pot.
 * @property {function} onWithdraw - Fonction appelée lorsque l'utilisateur retire de l'argent d'un pot.
 */
interface PotstProps {
  onEditPot: (pot: Pot) => void;
  onDeletePot: (pot: Pot) => void;
  onAddMoney: (pot: Pot) => void;
  onWithdraw: (pot: Pot) => void;
}

/**
 * Composant Pots pour afficher la liste des pots d'épargne.
 *
 * Ce composant affiche chaque pot dans une carte avec des actions telles que l'ajout d'argent, le retrait,
 * l'édition ou la suppression. Chaque pot a une barre de progression animée qui est affichée lorsqu'elle est visible dans le viewport.
 *
 * @param {PotstProps} props - Les props pour configurer les différentes actions disponibles dans la liste des pots.
 * @returns {JSX.Element} - Le JSX pour afficher la liste des pots.
 */
const Pots: React.FC<PotstProps> = ({ onEditPot, onAddMoney, onWithdraw }) => {
  const { pots, deletePot } = usePot(); // Utilise le contexte pour accéder aux pots

  // État pour gérer la visibilité de la popup de suppression
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [potToDelete, setPotToDelete] = useState<Pot | null>(null);
  // État pour gérer la visibilité des barres de progression
  const [visiblePotProgressBars, setVisiblePotProgressBars] = useState<
    Record<string, boolean>
  >({});

  /**
   * Ouvre la popup de confirmation pour supprimer un pot.
   * @param {Pot} pot - Le pot à supprimer.
   */
  const handleDeletePot = (pot: Pot) => {
    setPotToDelete(pot); // Définit le pot sélectionné pour suppression
    setIsDeletePopupOpen(true); // Ouvre la popup de confirmation
  };

  /**
   * Ferme la popup de suppression.
   */
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false); // Ferme la popup
  };

  /**
   * Confirme la suppression du pot sélectionné.
   */
  const confirmDeletePot = () => {
    if (potToDelete) {
      deletePot(potToDelete.name); // Supprime le pot en fonction de son nom
      closeDeletePopup(); // Ferme la popup après suppression
    }
  };

  /**
   * Gère la visibilité des barres de progression pour chaque pot.
   * @param {string} potName - Le nom du pot.
   * @param {boolean} isVisible - Indique si la barre est visible dans le viewport.
   */
  const handleProgressBarVisibility = (potName: string, isVisible: boolean) => {
    setVisiblePotProgressBars((prev) => ({
      ...prev,
      [potName]: isVisible,
    }));
  };

  /**
   * Utilise l'API IntersectionObserver pour déclencher l'animation des barres de progression lorsqu'elles sont visibles.
   */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    pots.forEach((pot) => {
      const progressBarRef = document.getElementById(
        `progress-bar-${pot.name}`
      );
      if (progressBarRef) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                handleProgressBarVisibility(pot.name, true); // Déclenche l'animation
                observer.unobserve(entry.target); // Désactive l'observation après l'animation
              }
            });
          },
          {
            threshold: 0.5, // Se déclenche lorsque 50% de la barre est visible
          }
        );

        observer.observe(progressBarRef);
        observers.push(observer);
      }
    });

    // Nettoyage des observateurs lorsque le composant est démonté
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [pots]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {pots.map((pot, index) => (
        <div
          key={index}
          className="bg-white col-span-1 max-[468px]:w-[343px] w-[517px] h-[303px] flex flex-col justify-between gap-y-8 rounded-xl p-6"
        >
          {/* Popup de confirmation de suppression */}
          <DeleteConfirmation
            isOpen={isDeletePopupOpen}
            onClose={closeDeletePopup}
            itemType="pot"
            itemName={potToDelete ? potToDelete.name : ""}
            onConfirm={confirmDeletePot}
          />

          {/* En-tête du pot */}
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              {/* Couleur du pot */}
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

          {/* Informations sur le pot (total économisé, barre de progression, cible) */}
          <div className="flex flex-col justify-between gap-y-4">
            <div className="flex justify-between items-center">
              <p className="text-preset-4 text-grey-500">Total Saved</p>
              <p className="text-preset-1 text-grey-900 font-bold">
                $
                {pot.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Barre de progression */}
            <div className="flex flex-col gap-y-3.5">
              <div
                id={`progress-bar-${pot.name}`}
                className="w-full h-2 p-0 bg-beige-100 rounded flex justify-start items-start"
              >
                <div
                  className={`self-stretch rounded transition-all duration-1000 ease-in-out ${
                    visiblePotProgressBars[pot.name] ? "w-[100%]" : "w-0"
                  }`}
                  style={{
                    width: visiblePotProgressBars[pot.name]
                      ? `${(pot.total / pot.target) * 100}%`
                      : "0%",
                    backgroundColor: pot.theme,
                  }}
                />
              </div>

              {/* Cible du pot */}
              <div className="flex justify-between items-center">
                <p className="text-preset-5 text-grey-500 font-bold">
                  {((pot.total / pot.target) * 100).toFixed(1)}%
                </p>
                <p className="text-preset-5 text-grey-500">
                  Target of ${pot.target.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>

          {/* Actions disponibles */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onAddMoney(pot)} // Ajoute de l'argent à ce pot
            >
              + Add Money
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onWithdraw(pot)} // Retire de l'argent de ce pot
            >
              Withdraw
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pots;
