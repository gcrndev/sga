import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { authApi, setUnauthorizedHandler } from "@/lib/api";

export type User = {
  id: number;
  name: string;
  email: string;
  user_type: string;
  role: string;
  law_firm_id: number;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerFirm: (payload: Parameters<typeof authApi.registerFirm>[0]) => Promise<void>;
  completeInvite: (payload: Parameters<typeof authApi.completeInvite>[0]) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      window.location.href = "/login";
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authApi.me();
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const registerFirm = async (payload: Parameters<typeof authApi.registerFirm>[0]) => {
    const res = await authApi.registerFirm(payload);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const completeInvite = async (payload: Parameters<typeof authApi.completeInvite>[0]) => {
    const res = await authApi.completeInvite(payload);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isLoading, login, registerFirm, completeInvite, logout }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
