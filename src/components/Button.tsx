import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  onClick,
  variant = 'primary',
  className = '',
  fullWidth = false,
  disabled = false,
  color = '#3b78df',
}) => {
  const baseClasses = 'py-3 px-2 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg';
  
  const variantClasses = {
    primary: `hover:bg-opacity-90 focus:ring-opacity-50 text-white`,
    secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700',
    outline: 'bg-white hover:bg-gray-100 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700 border border-gray-300',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: color }}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
