import CaretLeftIcon from "@/assets/images/icon-caret-left.svg";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  setPage,
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-12">
      {/* Bouton Prev */}
      <button
        type="button"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-10 p-4 rounded-lg flex items-center justify-center gap-2 bg-white border border-grey-300 text-grey-900${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <CaretLeftIcon />
        <span className="text-grey-900 text-preset-4">Prev</span>
      </button>

      {/* Numéros de page */}
      <div className="flex items-center gap-2">
        {generatePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`w-10 h-10 p-4 rounded-lg flex items-center justify-center ${
              currentPage === page
                ? "bg-grey-900 text-white"
                : "bg-white border border-grey-300 text-grey-900"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Bouton Next */}
      <button
        type="button"
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-10 p-4 rounded-lg flex items-center justify-center gap-2 bg-white border border-grey-300 text-grey-900 ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span className="text-grey-900 text-preset-4">Next</span>
        <CaretRightIcon />
      </button>
    </div>
  );
}
