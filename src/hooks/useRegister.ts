import { useAuth } from "../stores/authStore";
export const useRegister = () => {
  const { register, isRegistering, registerError } = useAuth();
  
  return {
    register,
    isPending: isRegistering,
    error: registerError
  };
};
