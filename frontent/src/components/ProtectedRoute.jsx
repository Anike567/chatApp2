import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../store/authContext';
import { SocketContext } from '../store/socketIdContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const { authData } = useContext(AuthContext);
  const { socketLoading } = useContext(SocketContext); 

  if (socketLoading) return <Loader />;

  if (!authData?.isLoggedIn) return <Navigate to="/login" />;

  return children;
}
