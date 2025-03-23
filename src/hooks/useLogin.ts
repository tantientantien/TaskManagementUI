import { useAuth } from "../stores/authStore";


export const useLogin = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  
  return {
    login,
    isPending: isLoggingIn,
    error: loginError
  };
};