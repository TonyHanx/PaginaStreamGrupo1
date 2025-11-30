import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,   
} from "react";
import { authService } from "../services/authService";

type AuthContextType = {
  isAuthed: boolean;
  login: () => void;
  logout: () => void;
  user: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    return authService.isAuthenticated();
  });
  
  const [user, setUser] = useState<any>(() => {
    return authService.getUser();
  });

  const login = () => {
    setIsAuthed(true);
    setUser(authService.getUser());
  };

  const logout = () => {
    authService.removeToken();
    authService.removeUser();
    setIsAuthed(false);
    setUser(null);
  };

  useEffect(() => {
    // Verificar si hay token al cargar
    if (authService.isAuthenticated()) {
      setIsAuthed(true);
      setUser(authService.getUser());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper para usar el contexto
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}