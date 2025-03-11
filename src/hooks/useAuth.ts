import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export const useAuth = () => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation<LoginResponse, AxiosError, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axios.post<LoginResponse>(
        'https://localhost:7186/login',
        credentials
      );
      return response.data;
    },
    onSuccess: async (data) => {
      const { tokenType, accessToken, expiresIn, refreshToken } = data;
      
      Cookies.set('.AspNetCore.Identity.Application', `${tokenType} ${accessToken}`, { expires: expiresIn / 86400 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });

      try {
        const res = await axios.get('/me');
        setUser(res.data);
      } catch (error) {
        console.log(error)
        setUser(null);
      }

      navigate('/dashboard');
    },
    onError: (error: AxiosError) => {
      console.error("Login failed", error.response?.data || error.message);
    }
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};