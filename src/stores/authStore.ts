// useAuth.ts (chỉ giữ logic store, không điều hướng)
import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { AuthState, LoginData, RegisterData } from "../structures/others";
import { BASE_URL } from "../config/environment";

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoggingIn: false,
  isRegistering: false,
  loginError: null,
  registerError: null,

  getMe: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        withCredentials: true,
      });
      set({ user: response.data.data });
    } catch {
      set({ user: null });
    }
  },

  login: async (data: LoginData) => {
    const { useCookies, ...credentials } = data;
    set({ isLoggingIn: true, loginError: null });
    try {
      await axios.post(
        `${BASE_URL}/login`,
        credentials,
        { params: { useCookies }, withCredentials: useCookies }
      );
      await get().getMe();
      set({ isLoggingIn: false });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      set({
        isLoggingIn: false,
        loginError: error instanceof Error ? error : new Error("Login failed"),
      });
      return false;
    }
  },

  register: async (data: RegisterData) => {
    set({ isRegistering: true, registerError: null });
    try {
      await axios.post(`${BASE_URL}/register`, data);
      set({ isRegistering: false });
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      set({
        isRegistering: false,
        registerError: error as AxiosError,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${BASE_URL}/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    set({ user: null });
  },
}));