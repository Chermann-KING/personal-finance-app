import CaretLeftIcon from "@/assets/images/icon-caret-left.svg";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";
import { useEffect, useState } from "react";

/**
 * Props pour le composant Pagination
 * @property {number} currentPage - La page actuellement sélectionnée dans la pagination.
 * @property {number} totalPages - Le nombre total de pages disponibles.
 * @property {function} setPage - Fonction de rappel pour mettre à jour la page sélectionnée.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

/**
 * Composant de pagination réactif pour naviguer entre différentes pages de résultats.
 *
 * Ce composant ajuste dynamiquement le nombre de pages visibles selon la taille de l'écran :
 * - Sur les téléphones (taille < 640px), il affiche 3 pages autour de la page active.
 * - Sur les tablettes et ordinateurs (taille >= 640px), il affiche 5 pages autour de la page active.
 *
 * Les boutons "Précédent" et "Suivant" permettent de naviguer d'une page à l'autre.
 *
 * @param {PaginationProps} props - Les props nécessaires pour le composant.
 * @returns JSX.Element
 */
export default function Pagination({
  currentPage,
  totalPages,
  setPage,
}: PaginationProps) {
  const [windowWidth, setWindowWidth] = useState(0); // État pour stocker la largeur de la fenêtre

  /**
   * Fonction pour déterminer les numéros de pages visibles autour de la page actuelle.
   * Elle ajuste dynamiquement la plage de pages en fonction de la largeur de l'écran.
   * - Pour les appareils mobiles (< 640px), 3 pages sont affichées autour de la page actuelle.
   * - Pour les tablettes et ordinateurs (>= 640px), 5 pages sont affichées.
   *
   * @returns {number[]} - Un tableau des numéros de pages à afficher.
   */
  const getVisiblePages = (): number[] => {
    const isMobile = windowWidth < 640; // Tailwind "sm" breakpoint
    const maxVisiblePages = isMobile ? 3 : 5; // 3 pages pour mobile, 5 pour tablette/ordinateur

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajuste le début si la plage dépasse la limite des pages disponibles
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  /**
   * useEffect pour gérer les redimensionnements de la fenêtre.
   * Il met à jour l'état `windowWidth` à chaque fois que la taille de la fenêtre change,
   * permettant ainsi d'ajuster le nombre de pages visibles.
   */
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Appel initial pour définir la largeur actuelle
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-between items-center mt-12">
      {/* Bouton "Précédent" */}
      <button
        type="button"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`h-10 p-4 rounded-lg flex items-center justify-center gap-2 bg-white border border-grey-300 text-grey-900${
          currentPage === 1 ? " opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <CaretLeftIcon aria-hidden="true" />
        <span className="text-grey-900 text-preset-4">Prev</span>
      </button>

      {/* Liste des numéros de pages */}
      <div className="flex items-center gap-2">
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`w-10 h-10 p-4 rounded-lg flex items-center justify-center ${
              currentPage === page
                ? "bg-grey-900 text-white" // Style pour la page active
                : "bg-white border border-grey-300 text-grey-900"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Bouton "Suivant" */}
      <button
        type="button"
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`h-10 p-4 rounded-lg flex items-center justify-center gap-2 bg-white border border-grey-300 text-grey-900${
          currentPage === totalPages ? " opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span className="text-grey-900 text-preset-4">Next</span>
        <CaretRightIcon aria-hidden="true" />
      </button>
    </div>
  );
}
