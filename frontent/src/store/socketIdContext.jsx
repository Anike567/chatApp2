import React, { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketIdContextProvider({ children }) {
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(null);
  const [socketLoading, setSocketLoading] = useState(true);

  useEffect(() => {
    const newSocket = io('http://192.168.1.44:3000');
    socketRef.current = newSocket;

    if (newSocket.connected) {
      setSocketId(newSocket.id);
      setSocketLoading(false);
    } else {
      newSocket.on('connect', () => {
        setSocketId(newSocket.id);
        setSocketLoading(false);
      });
    }

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketId, socket: socketRef.current, socketLoading }}>
      {children}
    </SocketContext.Provider>
  );
}
