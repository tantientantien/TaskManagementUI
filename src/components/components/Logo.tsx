import React from "react";
import { LogoProps } from "../../structures/component";

const Logo: React.FC<LogoProps> = ({
  className,
  sourceLogo,
  width = "w-20",
}) => {
  return (
    <div className={`flex items-center space-x-5 justify-center ${className}`}>
      <img className={`h-auto ${width}`} src={sourceLogo} alt="Logo" />
    </div>
  );
};

export default Logo;
