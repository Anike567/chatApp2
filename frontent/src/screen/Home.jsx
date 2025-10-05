import { useContext, useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { SocketContext } from "../store/socketIdContext";
import { AuthContext } from "../store/authContext";
import UpdateProfile from "../components/UpdateProfile";
import ForgetPassword from "./ForgetPassword";
import FriendRequests from "../components/FriendRequests";
import Message from "../components/Message";
import SelectedUser from "../components/SelectedUser";
import MessageInput from "../components/MessageInput";
import User from "../components/User";
import Logout from "../components/Logout";
import Header from "../components/Header";


/**
 * Home chat component
 * @returns {JSX.Element}
 */
export default function Home() {
  const { user, token } = useContext(AuthContext).authData;
  const { socket, socketId } = useContext(SocketContext);
  const [isLoading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageEndRef = useRef(null);
  const [userStatus, setUserStatus] = useState(null);
  const [friendsList, setFriendList] = useState([]);


  const menuItems = [
    { id: 1, label: "Change Profile Picture" },
    { id: 2, label: "Change Password" },
    { id: 3, label: "Friend Requests" },
    { id: 4, label: "Logout" },
  ];

  const settingComponents = {
    1: <UpdateProfile />,
    2: <ForgetPassword />,
    3: <FriendRequests />,
    4: <Logout user={user} />
  };


  

  /**
   * Scroll chat to the latest message
   * @returns {void}
   */
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getSelectedUserStatus = () => {
    socket.emit("heartbeat", { userId: selectedUser.u__id }, (data) => {
      if (data.error) {
        alert(data.message);
        return;
      }

      setUserStatus(data.data);
    });
  }
  // Debounced search logging
  



  /**
   * Send a message via socket
   * @param {KeyboardEvent | MouseEvent} 
   * @returns {void}
   */
  const handleSend = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (!message.trim() || !selectedUser) return;

      const msgPayload = {
        token: token,
        msg: {
          to: selectedUser.u__id,
          from: user._id,
          deleiverd: null,
          message,
        }

      };

      socket.emit("message-received", msgPayload, (data) => {
        if (data.error) {
          alert(data.message);
        } else {
          const deleivered = data.status;
          if (deleivered) {
            msgPayload.msg.deleiverd = 'delievered';
          }
          else {
            msgPayload.msg.deleiverd = 'pending'
          }
        }

        setMessageList(prev => [...prev, msgPayload.msg]);
        setMessage("");
      });

    }
  };

  //Setup socket listeners and fetch initial data

  useEffect(() => {
    let intervalId;
    if (selectedUser) {
      socket.emit("updateSocketId", { userId: user._id, socketid: socketId });
      getSelectedUserStatus();

      const payload = {
        token,
        data: {
          to: selectedUser.u__id,
          from: user._id
        }
      }

      socket.emit("getMessages", payload, (data) => {
        if (data.error) {
          alert(data.message);
        }
        setMessageList(data.savedMessages);
      });

      // Heartbeat interval
      intervalId = setInterval(getSelectedUserStatus, 30000);


    }

    return () => {
      clearInterval(intervalId); // ✅ cleanup works properly
    };

  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getuser", { token }, (data) => {
      if (data.error) {
        alert(data.message);
      }
      else {

        setFriendList(new Set(data.message.users.map(data => data.u__id)));
        setUserList(data.message.users);
        setLoading(false)
      }
    });



    const handleIncomingMessage = (data) => {
      console.log(data);
      setMessageList(prev => [...prev, data]);
    };

    const handleConnectionError = (err) => {
      console.log(err.message);
      alert(err.message);
    }
    socket.on("message-received", handleIncomingMessage);
    socket.on("connect_error", handleConnectionError);

    return () => {
      socket.off("message-received", handleIncomingMessage);
      socket.off("connect_error", handleConnectionError);
    };
  }, [socket, socketId]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();

  }, [messageList]);


  if (isLoading) {
    return (

      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <Loader />
      </div>


    );
  }

  return (
    <div className="flex h-full w-full px-4 py-6 bg-white space-x-4">
      {/* Left Sidebar */}
      <div className="w-full sm:w-[22%] h-full bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col h-full">
          {/* Header */}
          <Header friendsList = {friendsList}/>

          {/* User List */}
          <div className="flex-1 overflow-auto">
            {userList
              .map((tmpUser, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedUser(tmpUser);
                    
                  }}
                  className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-blue-100 transition duration-200"
                >
                  <User tmpUser={tmpUser} user={user} />
                </div>
              ))}
          </div>

        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 h-full bg-gray-50 border border-gray-300 rounded-2xl shadow-sm flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <SelectedUser user={selectedUser} userStatus={userStatus} />

            {/* Messages */}


            <div className="flex-1 p-6 overflow-auto space-y-3">
              {messageList.map((msg, index) => (
                <Message key={index} msg={msg} user={user} />
              ))}
              <div ref={messageEndRef}></div>
            </div>


            {/* Input */}
            <MessageInput setMessage={setMessage} handleSend={handleSend} message={message} />

          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <h1 className="text-xl font-semibold text-gray-500">
              Your messages will appear here
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
