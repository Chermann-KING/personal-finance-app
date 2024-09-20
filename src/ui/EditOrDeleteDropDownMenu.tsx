import React, { useEffect, useRef, useState } from "react";
import EllipsisIcon from "@/assets/images/icon-ellipsis.svg";

interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton d'ouverture du dropdown */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="text-grey-500 cursor-pointer"
      >
        <EllipsisIcon />
      </button>

      {/* Menu dropdown */}
      <div
        role="menu"
        className={`absolute right-0 w-[134px] px-5 py-3 mt-2 bg-white shadow-lg rounded-md transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        } z-10`}
      >
        <ul className="divide-y divide-grey-100">
          <li
            className="py-3 text-preset-4 text-grey-900 cursor-pointer"
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
          >
            {editLabel}
          </li>
          <li
            className="py-3 text-preset-4 text-red cursor-pointer"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          >
            {deleteLabel}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
