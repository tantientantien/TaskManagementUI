import { useState } from "react";

export const useFormShake = () => {
  
  const [shake, setShake] = useState(false);

  const triggerShakeAnimation = () => {
    setShake(true);
    setTimeout(() => setShake(false), 1000);
  };

  return { shake, triggerShakeAnimation };
};