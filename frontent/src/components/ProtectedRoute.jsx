import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const data = true; 

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
