import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface RegisterCredentials {
  email: string;
  password: string;
}

export const useRegister = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation<void, AxiosError, RegisterCredentials>({
    mutationFn: async (credentials: RegisterCredentials) => {
      await axios.post('https://localhost:7186/register', credentials);
    },
    onSuccess: () => {
      navigate('/login');
    },
  });

  return {
    register: registerMutation.mutate,
    isPending: registerMutation.isPending,
    error: registerMutation.error,
  };
};