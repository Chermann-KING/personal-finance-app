import React from "react";

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  value?: string;
  placeholder?: string;
  helperText?: string;
  icon?: JSX.Element;
  prefix?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  helperText,
  icon,
  prefix,
  onChange,
}) => {
  // affichage
  const placeholderStyle = {
    fontSize: "0.875rem",
    letterSpacing: "0px",
    lineHeight: "150%",
  };
  return (
    <div className="w-full min-w-56">
      {label && (
        <label
          htmlFor={name}
          className="block text-preset-5 font-bold text-gray-500 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-lg">
        {/* Préfixe */}
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[19px]">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        {/* Champ input */}
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          className={`block w-full rounded-md border-0 py-3.5 ${
            prefix ? "pl-10" : "pl-[19px]"
          } ${
            icon ? "pr-11" : "pr-[19px]"
          } text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6`}
          style={placeholderStyle}
          onChange={onChange}
        />
        {/* Icône */}
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-[19px]">
            <span className={`text-gray-500`}>{icon}</span>
          </div>
        )}
      </div>
      {/* Texte d'aide */}
      {helperText && (
        <p className="mt-1 text-grey-500 text-preset-5 text-right">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default InputField;
