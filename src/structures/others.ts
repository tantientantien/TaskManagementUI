import { User } from "./model";
import { AxiosError } from "axios";
export interface LoginData {
  email: string;
  password: string;
  useCookies?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
}



export interface AuthState {
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginError: Error | null;
  registerError: AxiosError | null;
  user: User | null;

  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
}


export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  assigneeId?: number;
  duedate?: string; // ISO 8601 format (e.g., "2025-03-22T06:50:45.882Z")
  isCompleted?: boolean;
  categoryId?: number;
}
