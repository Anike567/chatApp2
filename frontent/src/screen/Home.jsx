import { useContext, useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { HiDotsVertical } from "react-icons/hi";
import { SocketContext } from "../store/socketIdContext";
import { AuthContext } from "../store/authContext";
import Modal from "./../components/Modal";
import UpdateProfile from "../components/UpdateProfile";
import ForgetPassword from "./ForgetPassword";
import FriendRequests from "../components/FriendRequests";
import Message from "../components/Message";
import SelectedUser from "../components/SelectedUser";
import MessageInput from "../components/MessageInput";
import SearchResult from "../components/SearchResult";
import User from "../components/User";
import Logout from "../components/Logout";


/**
 * Home chat component
 * @returns {JSX.Element}
 */
export default function Home() {
  const { user, token } = useContext(AuthContext).authData;
  const { socket, socketId } = useContext(SocketContext);
  const [isLoading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showSetting, setShowSetting] = useState(false);
  const [settingOption, setSettingOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const messageEndRef = useRef(null);
  const [searchRsult, setSearchResult] = useState([]);
  const [selected, setSelected] = useState(null);
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
   * 
   * send friend request to friend
   */
  const sendFrienRequest = (toId) => {

    const payload = {
      from: user._id,
      to: toId
    }
    socket.emit("addFriend", payload, (data) => {
      console.log(data);
    })
  }

  /**
   * Scroll chat to the latest message
   * @returns {void}
   */
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Debounced search logging
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText.trim()) {
        socket.emit("search", searchText.trim(), (result) => {
          setSearchResult(result);
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);



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

    if (selectedUser) {

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
        console.log(data);
        setMessageList(data.savedMessages);
      });
    }

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

    socket.emit("updateSocketId", { userId: user._id, socketid: socketId });

    const handleIncomingMessage = (data) => {
      setMessageList(prev => [...prev, data]);
    };

    socket.on("message-received", handleIncomingMessage);

    return () => {
      socket.off("message-received", handleIncomingMessage);
    };
  }, [socket, token, selectedUser, user._id, socketId]);

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
          <div className="p-5 border-b bg-white shadow-sm">
            <div className="flex justify-between items-center px-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
              <HiDotsVertical color="black" size={25} className="cursor-pointer" onClick={() => { setShowSetting((prev) => !prev) }} />
            </div>

            <div className="relative">
              <input
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                type="text"
                placeholder="Search by email or username"
                className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none"
              />

              {/**
               * 
               * popup for setting 
               * options like upload dp, change dp , delete dp 
               */}

              {showSetting && (
                <div
                  tabIndex={0}
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-md">
                  <ul className="flex flex-col text-sm text-gray-700">
                    {menuItems.map((item) => (
                      <li
                        key={item.id}
                        className={`
            px-4 py-3 cursor-pointer transition-all rounded-md text-lg text-bold
            ${selected === item.id
                            ? "bg-blue-500 text-white shadow-md"
                            : "hover:bg-blue-50 hover:shadow-md hover:text-blue-600"
                          }
          `}
                        onClick={() => { setSettingOption(item.id); setIsOpen(true) }}
                        onMouseEnter={() => { setSelected(item.id) }}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>


              )}
              {settingOption && (
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                  {settingComponents[settingOption]}
                </Modal>
              )}

              {searchText.trim() && searchRsult.length > 0 && (
                <SearchResult searchRsult={searchRsult} friendList={friendsList} />
              )}


            </div>

          </div>

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
            <SelectedUser user={selectedUser} />

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
