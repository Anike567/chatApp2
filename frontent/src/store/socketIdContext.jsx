import React, { createContext, useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from "../store/authContext";
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

export const SocketContext = createContext();

export  function SocketIdContextProvider({ children }) {
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(null);
  const [socketLoading, setSocketLoading] = useState(true);
  const { user, token } = useContext(AuthContext).authData;
  const navigate = useNavigate();
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  useEffect(() => {
    // If no user or token, redirect
    if (!user || !token) {
      navigate('/login');
      return; 
    }

    // Create socket connection
    const newSocket = io(`${socketUrl}/app`, {
      auth: { token }
    });

    socketRef.current = newSocket;

    // When connected, update state
    newSocket.on('connect', () => {
      newSocket.emit("updateSocketId", { userId: user._id, socketid: newSocket.id });
      setSocketId(newSocket.id);
      setSocketLoading(false);
    });

    // Optional: handle errors / disconnection
    newSocket.on('disconnect', () => {
      setSocketId(null);
      setSocketLoading(true);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketId, socket: socketRef.current, socketLoading }}>
      {children}
    </SocketContext.Provider>
  );
}
