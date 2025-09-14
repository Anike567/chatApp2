
import { BiCheckDouble } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { useContext, useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { FiPhoneCall, FiSend, FiUser, FiVideo } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { SocketContext } from "../store/socketIdContext";
import { AuthContext } from "../store/authContext";
import { FaCheck } from "react-icons/fa";
import Modal from "./../components/Modal";
import UpdateProfile from "../components/UpdateProfile";
import ForgetPassword from "./ForgetPassword";
import { data } from "react-router-dom";
import FriendRequests from "../components/FriendRequests";


/**
 * Home chat component
 * @returns {JSX.Element}
 */
export default function Home() {
  const allMessages = useRef([]);
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
  const[unSavedMessage, setUnSavedMessage] = useState([]);
  const [selected, setSelected] = useState(1);


  const menuItems = [
    { id: 1, label: "Change Profile Picture" },
    { id: 2, label: "Change Password" },
    { id: 3, label: "Friend Requests" },
  ];

  const settingComponents = {
    1: <UpdateProfile />,
    2: <ForgetPassword />,
    3: <FriendRequests/>
  };


  /**
   * 
   * send friend request to friend
   */
  const sendFrienRequest = (toId)=>{
    console.log("working");
    const payload = {
      from : user._id,
      to : toId
    }
    socket.emit("addFriend",payload,(data)=>{
      console.log(data);
    })
  }


  /**
   * this will create a new webrtch connection
   */

  const handlePhoneCall = async () => {
    const pc = new RTCPeerConnection();

    const stream = await navigator.mediaDevices({ audio: true, video: false });
  }

  /**
   * Update selected conversation messages
   * @returns {void}
   */
  const updateSelectedMessageList = () => {
    if (!selectedUser) return;
    setMessageList(
      allMessages.current.filter(
        (msg) =>
          (msg.from === user._id && msg.to === selectedUser._id) ||
          (msg.from === selectedUser._id && msg.to === user._id)
      )

    );
  };

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
   * @param {KeyboardEvent | MouseEvent} e
   * @returns {void}
   */
  const handleSend = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (!message.trim() || !selectedUser) return;

      const msgPayload = {
        to: selectedUser._id,
        from: user._id,
        deleiverd: null,
        message,
      };

      setUnSavedMessage( prev => [...prev, msgPayload]);
      await socket.emit("message-received", msgPayload, (deleivered) => {
        console.log(deleivered);
        if (deleivered) {
          msgPayload.deleiverd = 'delievered';


        }
        else {
          msgPayload.deleiverd = 'pending'
        }
        allMessages.current.push(msgPayload);

        updateSelectedMessageList();
        localStorage.setItem("messages", JSON.stringify(allMessages.current));
        setMessage("");
      });

    }
  };

  //Setup socket listeners and fetch initial data

  useEffect(() => {

    if (selectedUser) {
      updateSelectedMessageList();
    }

  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getuser", { token }, (res) => {
      setUserList(res.message.users);
      setLoading(false);
    });

    socket.emit("updateSocketId", { userId: user._id, socketid: socketId });

    const handleIncomingMessage = (data) => {
      allMessages.current.push(data);
      localStorage.setItem("messages", JSON.stringify(allMessages.current));
      updateSelectedMessageList();

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

  // Load stored messages once on mount
  useEffect(() => {
    const stored = localStorage.getItem("messages");
    allMessages.current = stored ? JSON.parse(stored) : [];

    return ()=>{
      console.log(unSavedMessage);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
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
                  onFocus={()=>console.log("working")}
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
                        onClick={() => { console.log(item.id); setSettingOption(item.id); setIsOpen(true) }}
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
                <div className="absolute z-100 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
                  {searchRsult.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                      {/* Left side: DP + user details */}
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          {result.dp ? (
                            (() => {
                              const blob = new Blob([result.dp], { type: "image/png" });
                              const url = URL.createObjectURL(blob);
                              return (
                                <img
                                  src={url}
                                  alt="user dp"
                                  className="w-full h-full object-cover"
                                />
                              );
                            })()
                          ) : (
                            <FiUser size={24} className="text-gray-700" />
                          )}
                        </div>

                        {/* Space between dp and text */}
                        <div className="ml-3">
                          <p className="text-gray-800 font-medium">{result.name}</p>
                          <p className="text-gray-500 text-sm">{result.email}</p>
                        </div>
                      </div>

                      {/* Friend request icon */}
                      <FiUserPlus
                        onClick={()=>{sendFrienRequest(result._id)}} 
                        size={30}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}


            </div>

          </div>

          {/* User List */}
          <div className="flex-1 overflow-auto">
            {userList
              // .filter((tmpUser) => tmpUser.email !== user.email)
              .map((tmpUser, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedUser(tmpUser);
                  }}
                  className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-blue-100 transition duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {tmpUser.dp ? (
                      (() => {
                        const blob = new Blob([tmpUser.dp], { type: "image/png" });
                        const url = URL.createObjectURL(blob);
                        return (
                          <img
                            src={url}
                            alt="user dp"
                            className="w-full h-full object-cover"
                          />
                        );
                      })()
                    ) : (
                      <FiUser size={24} className="text-gray-700" />
                    )}
                  </div>

                  <p className="text-lg font-medium text-gray-800">{tmpUser.email === user.email ? "You" : tmpUser.name}</p>

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
            <div className="flex items-center justify-between p-5 border-b bg-white shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <FiUser size={24} className="text-gray-700" />
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedUser.name}
                </p>
              </div>
              <div className="flex space-x-6">
                <FiPhoneCall
                  size={30}
                  color="black"
                  className="cursor-pointer"
                  onClick={handlePhoneCall}
                />
                <FiVideo size={30} color="black" className="cursor-pointer" />
              </div>
            </div>

            {/* Messages */}


            <div className="flex-1 p-6 overflow-auto space-y-3">
              {messageList.map((msg, index) => (
                <div key={index} className="w-full flex">
                  <div
                    className={`relative px-4 py-2 my-2 rounded-xl shadow-md break-words max-w-[75%] ${msg.from === user._id
                      ? "ml-auto bg-green-600 text-white"
                      : "mr-auto bg-blue-600 text-white"
                      }`}
                  >
                    <p className="text-lg mb-2 ">{msg.message}</p>
                    {msg.from === user._id && <span className="absolute  bottom-0 right-2 text-xs text-gray-200 flex items-center">
                      {msg.deleiverd === 'pending' ? <FaCheck size={15} /> : <BiCheckDouble size={25} />}
                    </span>}

                  </div>
                </div>
              ))}
              <div ref={messageEndRef}></div>
            </div>


            {/* Input */}
            <div className="p-5 border-t bg-white">
              <div className="flex items-center gap-4">
                <input
                  onKeyDown={handleSend}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  placeholder="Type a message..."
                  value={message}
                />
                <button
                  onClick={handleSend}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition duration-200 active:scale-95"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
            </div>
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
