import { createContext, useEffect, useState } from "react";
import Loader from "../components/Loader";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    user: null,
    token:null,
  });

  useEffect(() => {
    const parsedData = JSON.parse(localStorage.getItem("user-data"));

    if (parsedData) {
      setAuthData(parsedData);
    }

    setIsLoading(false);
  }, []); // ✅ Only run once

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}
