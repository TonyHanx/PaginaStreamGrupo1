import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,   
} from "react";

type AuthContextType = {
  isAuthed: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    // persistencia simple de demo
    return localStorage.getItem("auth") === "1";
  });

  const login = () => {
    setIsAuthed(true);
    localStorage.setItem("auth", "1");
  };

  const logout = () => {
    setIsAuthed(false);
    localStorage.removeItem("auth");
  };

  useEffect(() => {}, []);

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout }}>
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