import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
} from 'react';
import { AuthContext } from "../store/authContext";
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

export const SocketContext = createContext();

export function SocketIdContextProvider({ children }) {
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(null);
  const [socketLoading, setSocketLoading] = useState(true);
  const { user, token } = useContext(AuthContext).authData;
  const navigate = useNavigate();
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  useEffect(() => {
    // If no user or token, redirect and do not connect
    if (!user || !token) {
      return;
    }

    // Create socket connection
    const newSocket = io(`${socketUrl}/app`, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = newSocket;

    // When connected
    newSocket.on('connect', () => {
      newSocket.emit('updateSocketId', {
        userId: user._id,
        socketid: newSocket.id,
      }, (data) => {
        if (data.isUserStatusUpdated) {
          setSocketId(newSocket.id);
          setSocketLoading(false);
        }
        else {
          alert("Updation failed please try by refreshing the window")
        }
      });
    });

    // When disconnected
    newSocket.on('disconnect', () => {
      setSocketId(null);
      setSocketLoading(true);
    });

    // Handle connection error (e.g., invalid token)
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);

      // Optional — handle invalid token
      setSocketLoading(false);
      navigate('/login'); 
    });


    // Cleanup on unmount or when user/token changes
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, token, socketUrl, navigate]);



  useEffect(()=>{
    if(!user || !token){
      navigate("/login");
      return;
    }
  },[[user, token, socketLoading, navigate]]);

    // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    socketId,
    socket: socketRef.current,
    socketLoading,
  }), [socketId, socketLoading]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
