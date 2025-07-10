// src/store/socketIdContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketIdContextProvider({ children }) {
  const [socketId, setSocketId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setSocketId(newSocket.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketId, setSocketId, socket }}>
      {children}
    </SocketContext.Provider>
  );
}
