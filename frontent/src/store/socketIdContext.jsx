import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
} from "react";
import { AuthContext } from "../store/authContext";
import { io } from "socket.io-client";
import { Link, Navigate } from "react-router-dom";

export const SocketContext = createContext();

export function SocketIdContextProvider({ children }) {
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(null);
  const [socketLoading, setSocketLoading] = useState(true);
  const { authData, setAuthData } = useContext(AuthContext);
  const { user, token } = authData;
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  useEffect(() => {

    const newSocket = io(`${socketUrl}/app`, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      newSocket.emit(
        "updateSocketId",
        { userId: user._id, socketid: newSocket.id },
        (data) => {
          if (data.isUserStatusUpdated) {
            setSocketId(newSocket.id);
            setSocketLoading(false);
          } else {
            alert("Updation failed. Please refresh the window.");
          }
        }
      );
    });

    newSocket.on("disconnect", () => {
      setSocketId(null);
      setSocketLoading(true);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setAuthData({
        isLoggedIn: false,
        user: null,
        token: null,
      })
      setSocketLoading(false);
      setErrorMessage("Invalid or expired token. Please login again.");
      setError(true);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, token, socketUrl]);

  const value = useMemo(
    () => ({
      socketId,
      socket: socketRef.current,
      socketLoading,
    }),
    [socketId, socketLoading]
  );

  if (socketLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <p className="text-black font-semibold text-lg">Connecting...</p>
      </div>
    );
  }



  if (isError) {
    return (
      <Navigate to="/login" replace />
    );
  }



  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
