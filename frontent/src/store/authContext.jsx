import { createContext, useEffect, useState, useMemo } from "react";
import Loader from "../components/Loader";

const defaultAuth = {
  isLoggedIn: false,
  user: null,
  token: null,
};

export const AuthContext = createContext({
  authData: defaultAuth,
  setAuthData: () => {},
});

export default function AuthContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState(defaultAuth);

  // Restore user data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user-data");
      if (stored) setAuthData(JSON.parse(stored));
    } catch (err) {
      console.error("Error parsing user-data:", err);
      localStorage.removeItem("user-data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist auth data on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("user-data", JSON.stringify(authData));
    }
  }, [authData, isLoading]);

  const value = useMemo(() => ({ authData, setAuthData }), [authData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <Loader />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
