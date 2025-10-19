import { useContext, useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { SocketContext } from "../store/socketIdContext";
import { AuthContext } from "../store/authContext";
import User from "../components/User";
import Header from "../components/Header";
import Chats from "../components/Chats";


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
  
  
  
  const [friendsList, setFriendList] = useState([]);


  //Setup socket listeners and fetch initial data

  
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


    const handleConnectionError = (err) => {
      console.log(err.message);
      alert(err.message);
    }
   
    socket.on("connect_error", handleConnectionError);

    return () => {
      
      socket.off("connect_error", handleConnectionError);
    };
  }, [socket, socketId]);

  // Auto-scroll on new messages
 


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
      {selectedUser && <Chats selectedUser={selectedUser}/>}
    </div>
  );
}
