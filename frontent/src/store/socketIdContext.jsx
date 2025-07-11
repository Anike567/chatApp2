import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketIdContextProvider({ children }) {
  const [socketId, setSocketId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketLoading, setSocketLoading] = useState(true);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setSocketId(newSocket.id);
      setSocketLoading(false); 
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketId, setSocketId, socket, socketLoading }}>
      {children}
    </SocketContext.Provider>
  );
}
