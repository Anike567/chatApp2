import { Navigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { useContext } from "react";

export default function ProtectedRoute({ children }) {
  const {authData} = useContext(AuthContext);

  if (!authData.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
