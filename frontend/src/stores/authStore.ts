import { create } from "zustand";
import api from "../lib/api";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { username, password });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    set({ token, user, isAuthenticated: !!token });
  },
}));
