import { createContext, useState } from "react";


export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  
  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    user: null
  });

  return (

    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}
