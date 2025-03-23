import React from "react";
import { ButtonProps } from "../../structures/component";

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  fullWidth = false,
  disabled = false,
  title = "Button",
}) => {
  const baseClasses =
    "py-2 px-5 transition duration-300 ease-in-out rounded-md font-semibold focus:outline-none";

  const variantClasses = {
    primary: `bg-violet-500 text-white hover:bg-violet-700 hover:ring-2 hover:ring-violet-800 hover:shadow-xl hover:shadow-violet-500 focus:ring-violet-300 focus:shadow-violet-400`,
    primary_noborder: `bg-transparent text-auto hover:ring-violet-800 hover:shadow-xl hover:shadow-violet-500 focus:ring-violet-300 focus:shadow-violet-400`,
    secondary:
      "bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700",
    outline:
      "bg-white hover:bg-gray-100 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700 border border-gray-300",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className} flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  );
};

export default Button;
