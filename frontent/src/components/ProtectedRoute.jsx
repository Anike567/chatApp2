import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../store/authContext';
import { SocketContext } from '../store/socketIdContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const { authData } = useContext(AuthContext);
  

  if (!authData?.isLoggedIn || !authData.user || !authData.token) {
    
    return <Navigate to="/login" replace />;
  }

  return children;
}
