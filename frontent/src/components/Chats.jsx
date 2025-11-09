import { useState, useEffect, useRef, useContext, useCallback } from "react";
import SelectedUser from "./SelectedUser";
import MessageInput from "./MessageInput";
import { SocketContext } from "../store/socketIdContext";
import { AuthContext } from "../store/authContext";
import Message from "./Message";
import Loader from "./Loader";

export default function Chats({ selectedUser, userStatus }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const { socket } = useContext(SocketContext);
  const { user, token } = useContext(AuthContext).authData;

  const handleSend = useCallback((e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (!message.trim() || !selectedUser) return;

      const msgPayload = {
        token,
        msg: {
          to: selectedUser.u__id,
          from: user._id,
          delivered: null,
          message,
        },
      };

      socket.emit("message-received", msgPayload, (data) => {
        if (data.error) {
          alert(data.message);
          return;
        }

        msgPayload.msg.delivered = data.status ? "delivered" : "pending";
        setMessageList((prev) => [...prev, msgPayload.msg]);
        setMessage("");
      });
    }
  }, [message, selectedUser, socket, token, user]);

  const handleIncomingMessage = useCallback((data) => {
    setMessageList((prev) => [...prev, data]);
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    setLoading(true);

    const payload = {
      token,
      data: { to: selectedUser.u__id, from: user._id },
    };

    socket.emit("getMessages", payload, (data) => {
      if (data.error) {
        alert(data.message);
        setMessageList([]);
      } else {
        setMessageList(data.savedMessages);
      }
      setLoading(false);
    });
  }, [selectedUser, socket, token, user]);

  useEffect(() => {
    socket.on("message-received", handleIncomingMessage);
    return () => {
      socket.off("message-received", handleIncomingMessage);
    };
  }, [handleIncomingMessage, socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  if (isLoading) {
    return (
      <div className="flex-1 h-full bg-gray-50 border border-gray-300 rounded-2xl shadow-sm flex flex-col">
        <Loader />
      </div>
    );
  }


  return (
    <div className="flex-1 h-full bg-gray-50 border border-gray-300 rounded-2xl shadow-sm flex flex-col">
      {selectedUser ? (
        <>
          <SelectedUser user={selectedUser} userStatus={userStatus} />

          <div className="flex-1 p-6 overflow-auto space-y-3">
            {messageList.map((msg, index) => (
              <Message key={index} msg={msg} user={user} />
            ))}
            <div ref={messageEndRef}></div>
          </div>

          <MessageInput
            setMessage={setMessage}
            handleSend={handleSend}
            message={message}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center">
          <h1 className="text-xl font-semibold text-gray-500">
            Your messages will appear here
          </h1>
        </div>
      )}
    </div>
  );
}
