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
import { Navigate } from "react-router-dom";

export const SocketContext = createContext();

export function SocketIdContextProvider({ children }) {
  const [socket, setSocket] = useState(null); 
  const [socketId, setSocketId] = useState(null);
  const [undeleiverdMessage, setUndeleiveredMessage] = useState([]);
  const [socketLoading, setSocketLoading] = useState(true);
  const { authData, setAuthData } = useContext(AuthContext);
  const { user, token } = authData;
  const [isError, setIsError] = useState(false);
  
  const isMounted = useRef(false);

  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  useEffect(() => {
    if (!user || !token) {
      setSocketLoading(false);
      return;
    }

    isMounted.current = true;

    const newSocket = io(`${socketUrl}/app`, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    const onConnect = () => {
      console.log("Socket Connected:", newSocket.id);
      
      newSocket.emit(
        "updateSocketId",
        { userId: user._id, socketid: newSocket.id },
        (response) => {
          if (!isMounted.current) return;
          console.log(response);
          if (response?.isUserStatusUpdated) {
            setSocketId(newSocket.id);
            
            newSocket.emit('getUndeleiveredMessages', { user_id: user._id }, (msgData) => {
              console.log(msgData);
              if (msgData?.error) {
                alert(msgData.message);
              }
              // FIXED: Corrected logging variable
              setUndeleiveredMessage(msgData.data);
              
              if (isMounted.current) setSocketLoading(false);
            });
          } else {
            console.error("Failed to update socket ID on server");
          }
        }
      );
    };

    const onDisconnect = (reason) => {
      console.log("Socket Disconnected:", reason);
      if (isMounted.current) {
        setSocketId(null);
      }
    };

    const onConnectError = (err) => {
      console.error("Socket Connection Error:", err.message);
      
      if (err.message === "xhr poll error" || err.message === "server error") {
         return;
      }

      if (err.message.includes("jwt") || err.message.includes("token") || err.message.includes("auth")) {
        if (isMounted.current) {
          setIsError(true);
          setAuthData({ isLoggedIn: false, user: null, token: null });
        }
      }
    };

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("connect_error", onConnectError);

    return () => {
      isMounted.current = false;
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.disconnect();
    };
  }, [user?._id, token, socketUrl]);

  const value = useMemo(
    () => ({
      undeleiverdMessage,
      socketId,
      socket,
      socketLoading,
    }),
    // FIXED: Added undeleiverdMessage to dependency array
    [socketId, socket, socketLoading, undeleiverdMessage] 
  );

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  if (socketLoading && !socket) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <p className="text-black font-semibold text-lg">Connecting to Chat...</p>
      </div>
    );
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}