import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = () => {
  return (
    <div className="flex items-center space-x-5 justify-center">
      <img className="w-70 h-auto" src="/assets/logo.png" alt="Logo" />
    </div>
  );
};

export default Logo;
