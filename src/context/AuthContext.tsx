import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import Cookies from "js-cookie";

interface AuthContextProps {
  user: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie s'il y a un token dans les cookies
    const token = Cookies.get("authToken");
    if (token) {
      setUser(token);
      setIsAuthenticated(true); // Utilisateur connecté
    }
  }, []);

  const login = (token: string) => {
    setUser(token);
    Cookies.set("authToken", token); // Stocke le token dans un cookie
    setIsAuthenticated(true); // Utilisateur connecté
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("authToken"); // Supprime le token du cookie
    setIsAuthenticated(false); // Utilisateur déconnecté
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
