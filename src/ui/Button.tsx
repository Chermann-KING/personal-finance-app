import React from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "destroy";

interface ButtonProps {
  type?: "submit" | "reset" | "button";
  variant: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  variant,
  children,
  onClick,
  disabled,
  className,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-[17px] py-5 text-preset-4 font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-grey-900 text-white hover:bg-grey-500 focus:ring-grey-500",
    secondary:
      "bg-beige-100 text-grey-900 border border-beige-100 hover:bg-white hover:border-beige-500 focus:ring-beige-100",
    tertiary: "text-grey-500 hover:text-grey-900 focus:ring-grey-500",
    destroy: "bg-red text-white hover:opacity-80 focus:ring-red",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
      {variant === "tertiary" && <CaretRightIcon className="ml-3" />}
    </button>
  );
};

export default Button;
