import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { login as apiLogin, register as apiRegister } from "../services/apiService";

const TOKEN_KEY = "token";
const USERNAME_KEY = "username";

type AuthState = {
  token: string;
  username: string;
};

type AuthContextType = {
  auth: AuthState | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredAuth = (): AuthState | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const username = localStorage.getItem(USERNAME_KEY);
  return token && username ? { token, username } : null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState | null>(readStoredAuth);

  const persistAuth = useCallback((authState: AuthState) => {
    localStorage.setItem(TOKEN_KEY, authState.token);
    localStorage.setItem(USERNAME_KEY, authState.username);
    setAuth(authState);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setAuth(null);
  }, []);

  // Expired/invalid tokens cause the API layer to fire this event.
  useEffect(() => {
    window.addEventListener("auth:unauthorized", logout);
    return () => window.removeEventListener("auth:unauthorized", logout);
  }, [logout]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await apiLogin(username, password);
      persistAuth({ token: response.token, username: response.username });
    },
    [persistAuth]
  );

  const register = useCallback(
    async (username: string, password: string) => {
      const response = await apiRegister(username, password);
      persistAuth({ token: response.token, username: response.username });
    },
    [persistAuth]
  );

  const contextValue = useMemo(
    () => ({
      auth,
      isAuthenticated: auth !== null,
      login,
      register,
      logout,
    }),
    [auth, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
