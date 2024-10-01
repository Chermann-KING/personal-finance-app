import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import Cookies from "js-cookie";

/**
 * Interface pour les valeurs fournies par le contexte d'authentification.
 * @property {string | null} user - Le token de l'utilisateur authentifié, ou `null` si non authentifié.
 * @property {boolean} isAuthenticated - Indique si l'utilisateur est authentifié ou non.
 * @property {function} login - Fonction pour connecter l'utilisateur en fournissant un token.
 * @property {function} logout - Fonction pour déconnecter l'utilisateur.
 */
interface AuthContextProps {
  user: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Création du contexte d'authentification avec des valeurs par défaut.
const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

/**
 * Composant AuthProvider pour fournir le contexte d'authentification à l'application.
 *
 * Ce composant permet de gérer l'état d'authentification de l'utilisateur et de le rendre accessible à tous les composants enfants via le contexte.
 * Il utilise les cookies pour stocker et récupérer le token d'authentification.
 *
 * @param {ReactNode} children - Les composants enfants qui peuvent accéder au contexte d'authentification.
 * @returns {JSX.Element} - Le provider de contexte d'authentification avec les fonctions `login` et `logout`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Effet pour vérifier si un token d'authentification est déjà présent dans les cookies.
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setUser(token);
      setIsAuthenticated(true); // Si un token est présent, l'utilisateur est authentifié.
    }
  }, []);

  /**
   * Fonction pour connecter l'utilisateur en stockant le token dans les cookies.
   * @param {string} token - Le token d'authentification de l'utilisateur.
   */
  const login = (token: string) => {
    setUser(token);
    Cookies.set("authToken", token); // Stocke le token dans un cookie
    setIsAuthenticated(true); // L'utilisateur est désormais authentifié
  };

  /**
   * Fonction pour déconnecter l'utilisateur en supprimant le token des cookies.
   */
  const logout = () => {
    setUser(null);
    Cookies.remove("authToken"); // Supprime le token du cookie
    setIsAuthenticated(false); // L'utilisateur est désormais déconnecté
  };

  // Fournit les valeurs d'authentification à tous les composants enfants
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification.
 *
 * Ce hook permet à n'importe quel composant enfant de consommer le contexte d'authentification.
 * Il expose les fonctions `login`, `logout` ainsi que les états `user` et `isAuthenticated`.
 *
 * @returns {AuthContextProps} - Le contexte d'authentification actuel.
 */
export function useAuth() {
  return useContext(AuthContext);
}
